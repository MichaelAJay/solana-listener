import { Test, TestingModule } from '@nestjs/testing';
import { EventSubscriberService } from './event-subscriber.service';

describe('EventSubscriberService', () => {
  let service: EventSubscriberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventSubscriberService],
    }).compile();

    service = module.get<EventSubscriberService>(EventSubscriberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
