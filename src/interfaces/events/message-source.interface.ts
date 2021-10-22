import { Subject } from 'rxjs';
import { IEvent } from './event.interface';

export interface IMessageSource<EventBase extends IEvent = IEvent> {
  bridgeEventsTo(subject: Subject<EventBase>): any;
}
