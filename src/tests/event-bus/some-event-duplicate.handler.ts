import { EventsHandler } from '../../decorators';
import { IEventHandler } from '../../interfaces';
import { SomeEvent } from './some-event-duplicate';

@EventsHandler(SomeEvent)
export class SomeEventDuplicateHandler implements IEventHandler<SomeEvent> {
  handle(event: SomeEvent): void {
    console.log(this.constructor.name);
  }
}
