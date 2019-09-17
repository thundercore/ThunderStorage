import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { LoggerService } from './services/logger/logger.service'

@Module({
  imports: [],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {}
}
