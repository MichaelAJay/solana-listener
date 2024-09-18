import { Module } from '@nestjs/common';
import { EventSubscriberService } from './event-subscriber.service';
import { FileLoggerService } from 'src/file-logger.service';

@Module({
  providers: [EventSubscriberService, FileLoggerService],
  exports: [EventSubscriberService]
})
export class EventSubscriberModule {}
