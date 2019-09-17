import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { GeneralExceptionFilter } from './errors/exception.filter'
import { TypeOrmModule } from '@nestjs/typeorm'
import 'reflect-metadata'
import config from './config'
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository
} from 'typeorm-transactional-cls-hooked'
import { RouterModule } from 'nest-router'
import { routes } from './routes'
import { V1Module } from './modules/v1/v1.module'
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus'

initializeTransactionalContext()
patchTypeORMRepositoryWithBaseRepository()

@Module({
  imports: [
    TypeOrmModule.forRoot(config.postgres[0]),
    RouterModule.forRoutes(routes),
    V1Module,
    TerminusModule.forRootAsync({
      inject: [TypeOrmHealthIndicator],
      useFactory: db => ({
        endpoints: [
          {
            url: '/health',
            healthIndicators: [
              async () => db.pingCheck('database', { timeout: 500 })
            ]
          }
        ]
      })
    })
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionFilter
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
