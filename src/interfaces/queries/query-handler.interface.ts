import { Query } from './query';

export type IQueryHandler<QueryType extends Query<unknown> = Query<unknown>> =
  QueryType extends Query<infer ResultType>
    ? { execute(query: QueryType): Promise<ResultType> }
    : never;
