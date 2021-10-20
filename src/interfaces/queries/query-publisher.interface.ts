import { Query } from './query';

export interface IQueryPublisher<
  QueryBase extends Query<any> = Query<unknown>,
> {
  publish<T extends QueryBase = QueryBase>(query: T): any;
}
