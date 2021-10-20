import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '../../command-bus';
import { ExplorerService } from '../../services/explorer.service';
import { EventBus } from '../../event-bus';
import { SomeEvent } from './some.event';
import { SomeEventHandler } from './some-event.handler';
import { SomeEventDuplicateHandler } from './some-event-duplicate.handler';

export const getFixtures = () => {
  let module: TestingModule;
  let eventBus: EventBus;
  let handler1: jest.Mocked<SomeEventHandler>;
  let handler2: jest.Mocked<SomeEventDuplicateHandler>;
  return {
    async GivenThereAreTwoEventsWithTheSameName() {
      module = await Test.createTestingModule({
        providers: [
          CommandBus,
          EventBus,
          ExplorerService,
          SomeEventHandler,
          SomeEventDuplicateHandler,
        ],
      }).compile();

      eventBus = await module.resolve(EventBus);
      const explorer = await module.resolve(ExplorerService);
      const { events } = explorer.explore();
      eventBus.register(events);
      handler1 = await module.resolve(SomeEventHandler);
      handler1.handle = jest.fn();
      handler2 = await module.resolve(SomeEventDuplicateHandler);
      handler2.handle = jest.fn();
    },
    WhenTheEventIsDispatched() {
      eventBus.publish(new SomeEvent());
    },
    ThenOnlyHandlersRegisteredToThatEventAreExecuted() {
      expect(handler1.handle).toHaveBeenCalled();
      expect(handler2.handle).not.toHaveBeenCalled();
    },
  };
};
