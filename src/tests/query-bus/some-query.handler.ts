import { QueryHandler } from '../../decorators';
import { IQueryHandler } from '../../interfaces';
import { SomeQuery } from './some-query';

@QueryHandler(SomeQuery)
export class SomeQueryHandler implements IQueryHandler<SomeQuery> {
  execute(query: SomeQuery): Promise<number> {
    return Promise.resolve(0);
  }
}
