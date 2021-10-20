import { Query } from './query';

export interface IQueryBus {
  execute<TRes>(query: Query<TRes>): Promise<TRes>;
}
