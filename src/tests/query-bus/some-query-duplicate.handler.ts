import { QueryHandler } from '../../decorators';
import { IQueryHandler } from '../../interfaces';
import { SomeQuery } from './some-query-duplicate';

@QueryHandler(SomeQuery)
export class SomeQueryDuplicateHandler implements IQueryHandler<SomeQuery> {
  execute(query: SomeQuery): Promise<number> {
    return Promise.resolve(1);
  }
}
