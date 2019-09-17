import { Wallet } from 'ethers'
import {
  Provider,
  TransactionRequest,
  TransactionResponse
} from 'ethers/providers'
import { HDNode } from 'ethers/utils/hdnode'
import { NONCE_EXPIRED } from 'ethers/errors'
import { defer, Observable, Subject, timer, NEVER, EMPTY, merge } from 'rxjs'
import {
  distinctUntilChanged,
  catchError,
  filter,
  map,
  mapTo,
  switchMap,
  take,
  takeUntil,
  share,
  timeout,
  mergeMap
} from 'rxjs/operators'
import {
  Arrayish,
  bigNumberify,
  keccak256,
  populateTransaction,
  SigningKey,
  UnsignedTransaction
} from 'ethers/utils'
import { retryBackoff } from 'backoff-rxjs'

// WARNING!!!!!! this will fail if you are using ganache because it doesn't accept transactions with higher nonces
export class MnemonicWallet extends Wallet {
  private readonly EMPTY_TRANSACTION: TransactionRequest
  private readonly reset$ = new Subject()

  private nonceChange$: Observable<number>

  private initialNoncePromise: Promise<number>
  private nextNonce?: number

  constructor(
    privateKey: SigningKey | HDNode | Arrayish,
    provider: Provider,
    private timeoutMs = 10 * 1000
  ) {
    super(privateKey, provider)
    this.EMPTY_TRANSACTION = {
      to: this.address,
      value: bigNumberify(0).toHexString()
    }
    this.watchTransactionReceipt = this.watchTransactionReceipt.bind(this)
    this.sendTransactionObservable = this.sendTransactionObservable.bind(this)
    this.initialize()
  }

  protected initialize() {
    this.nextNonce = 0
    this.initialNoncePromise = this.getTransactionCount()

    this.nonceChange$ = this.watchNonce()
    this.reset$.next()
  }

  protected watchNonce(): Observable<number> {
    return timer(0, 400).pipe(
      mergeMap(() => defer(() => this.getTransactionCount())),
      distinctUntilChanged(),
      share()
    )
  }

  protected sendFallBackTransaction(nonce: number) {
    console.log(`sending empty transaction for: ${nonce}`)
    this.sendTransactionObservable({
      ...this.EMPTY_TRANSACTION,
      nonce
    })
      .pipe(
        retryBackoff({
          initialInterval: 300,
          maxRetries: 3,
          // do not retry nonce expired
          shouldRetry: err => err.code !== NONCE_EXPIRED
        }),
        switchMap(this.watchTransactionReceipt)
      )
      .subscribe(
        () => {
          console.log(`sent empty transaction for: ${nonce}`)
        },
        err => {
          if (err.code !== NONCE_EXPIRED) {
            console.error(
              `Error sending empty transaction for nonce ${nonce} resetting state`
            )
            // could not reset the nonce, need to reset the whole state
            this.initialize()
          }
        }
      )
  }

  protected sendTransactionObservable(
    transaction: TransactionRequest
  ): Observable<TransactionResponse> {
    return defer(() => {
      console.info(`sending transaction with nonce ${transaction.nonce}`)
      return super.sendTransaction(transaction)
    })
  }

  protected watchTransactionReceipt(transactionResponse: TransactionResponse) {
    return this.nonceChange$.pipe(
      filter(currentNonce => currentNonce > transactionResponse.nonce),
      // grab the transaction receipt
      mergeMap(() => {
        console.info(
          `getting receipt for transaction ${transactionResponse.nonce}`
        )
        return defer(() =>
          this.provider.getTransactionReceipt(transactionResponse.hash!)
        ).pipe(
          map(receipt => {
            if (!receipt) {
              throw 'No Receipt'
            }
            console.info(`receipt gotten ${transactionResponse.nonce}`)
            return receipt
          }),
          retryBackoff({ initialInterval: 100, maxRetries: 4 })
        )
      }),
      take(1)
    )
  }

  protected sendTransactionOnEachNonceChange(transaction: TransactionRequest) {
    // this will continue submitting until it gets unsubscribed
    return this.nonceChange$.pipe(
      // if the current nonce is less than or equal the sent nonce, send the transaction - this will send every interval if it does not complete
      filter(currentNonce => currentNonce <= transaction.nonce!),
      mergeMap(() => this.sendTransactionObservable(transaction)),
      mergeMap(() => NEVER),
      catchError(() => NEVER)
    )
  }

  protected sendTransactionFlow(
    transaction: TransactionRequest
  ): Observable<TransactionResponse> {
    return defer(() => this.assignNonce(transaction)).pipe(
      switchMap(trans =>
        this.sendTransactionObservable(trans).pipe(
          catchError(err => {
            console.log(err)
            // if we run into a nonce too low error, send the transaction back into the queue - the nonce will get auto incremented
            if (err.code === NONCE_EXPIRED) {
              console.info(`expired nonce ${transaction.nonce}`)
              return this.sendTransactionFlow(transaction)
            }
            // if there is any kind of error, replace the transaction with an empty transaction
            this.sendFallBackTransaction(transaction.nonce as number)
            throw err
          })
        )
      )
    )
  }

  private async assignNonce(transaction: TransactionRequest) {
    try {
      const nonce = await this.initialNoncePromise
      if (!this.nextNonce) {
        this.nextNonce = nonce
      }
      transaction.nonce = this.nextNonce
      this.nextNonce++
      return transaction
    } catch (e) {
      console.error(`Assigning nonce failed`)
      this.initialize()
      throw e
    }
  }

  async populateAndSignTransaction(trans: UnsignedTransaction) {
    const transaction = await populateTransaction(
      trans,
      this.provider,
      this.address
    )
    return {
      transaction,
      transactionHash: keccak256(await this.sign(transaction))
    }
  }

  async sendTransaction(
    transaction: TransactionRequest
  ): Promise<TransactionResponse> {
    const sentTransaction$ = this.sendTransactionFlow(transaction).pipe(
      takeUntil(this.reset$),
      take(1),
      share()
    )

    sentTransaction$
      .pipe(
        switchMap(transactionResponse => {
          console.info(
            `transaction sent ${transactionResponse.nonce}, watching receipt`
          )
          return merge(
            this.watchTransactionReceipt(transactionResponse).pipe(
              mapTo(transactionResponse),
              timeout(this.timeoutMs)
            ),
            this.sendTransactionOnEachNonceChange(transaction)
          ).pipe(
            take(1),
            catchError(() => {
              console.error(
                `Watching receipt failed, ${transactionResponse.nonce}`
              )
              this.initialize()
              return EMPTY
            })
          )
        }),
        // as soon as a reset event happens, drop everything else
        takeUntil(this.reset$)
      )
      .subscribe()

    return sentTransaction$.toPromise().then(resp => {
      if (!resp) {
        throw new Error('reset')
      }
      return resp
    })
  }
}
