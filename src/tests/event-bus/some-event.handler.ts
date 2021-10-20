import { EventsHandler } from '../../decorators';
import { SomeEvent } from './some.event';
import { IEventHandler } from '../../interfaces';

@EventsHandler(SomeEvent)
export class SomeEventHandler implements IEventHandler<SomeEvent> {
  handle(event): void {
    console.log(this.constructor.name);
  }
}
