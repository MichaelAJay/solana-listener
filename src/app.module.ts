import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventSubscriberModule } from './event-subscriber/event-subscriber.module';
import { ConfigModule } from '@nestjs/config';
import { FileLoggerService } from './file-logger.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EventSubscriberModule],
  controllers: [AppController],
  providers: [FileLoggerService],
})
export class AppModule {}
