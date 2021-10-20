import { Subject } from 'rxjs';
import { Query, IQueryPublisher } from '../interfaces';

export class DefaultQueryPubSub<QueryBase extends Query<unknown>>
  implements IQueryPublisher<QueryBase>
{
  constructor(private subject$: Subject<QueryBase>) {}

  publish<T extends QueryBase>(query: T) {
    this.subject$.next(query);
  }
}
