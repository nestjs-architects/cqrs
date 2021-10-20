import { IQuery, Query } from './query.interface';

export type IQueryHandler<
  QueryType extends IQuery,
  TRes = any,
> = QueryType extends Query<infer ResultType>
  ? BaseIQueryHandler<QueryType, ResultType>
  : BaseIQueryHandler<QueryType, TRes>;

interface BaseIQueryHandler<T extends IQuery = any, TRes = any> {
  execute(query: T): Promise<TRes>;
}
