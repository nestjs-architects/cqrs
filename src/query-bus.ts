import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import 'reflect-metadata';
import { QueryHandlerNotFoundException } from './exceptions';
import { InvalidQueryHandlerException } from './exceptions/invalid-query-handler.exception';
import { DefaultQueryPubSub } from './helpers/default-query-pubsub';
import {
  IQuery as QueryInterface,
  IQueryBus,
  IQueryHandler,
  IQueryPublisher,
  IQueryResult,
  Query,
} from './interfaces';
import { ObservableBus } from './utils/observable-bus';
import {
  getQueryId,
  reflectQueryId,
  reflectQueryName,
} from './helpers/reflect-query-bus';
import { QueryHandlerAlreadyAssignedException } from './exceptions/query-handler-already-assigned.exception';

type IQuery = Type<QueryInterface>;
export type QueryHandlerType<
  QueryBase extends IQuery = IQuery,
  QueryResultBase extends IQueryResult = IQueryResult,
> = Type<IQueryHandler<QueryBase, QueryResultBase>>;

@Injectable()
export class QueryBus<QueryBase extends IQuery = IQuery>
  extends ObservableBus<QueryBase>
  implements IQueryBus<QueryBase>
{
  private handlers = new Map<string, IQueryHandler<QueryBase, IQueryResult>>();
  private _publisher!: IQueryPublisher<QueryBase>;

  constructor(private readonly moduleRef: ModuleRef) {
    super();
    this.useDefaultPublisher();
  }

  get publisher(): IQueryPublisher<QueryBase> {
    return this._publisher;
  }

  set publisher(_publisher: IQueryPublisher<QueryBase>) {
    this._publisher = _publisher;
  }

  execute<TResult>(query: Query<TResult>): Promise<TResult>;
  execute<T extends QueryBase, TResult = any>(query: T): Promise<TResult>;
  async execute<T extends QueryBase, TResult = any>(
    query: T,
  ): Promise<TResult> {
    const queryId = getQueryId(query.constructor as Type<QueryBase>);
    const handler = this.handlers.get(queryId);
    if (!handler) {
      throw new QueryHandlerNotFoundException(queryId);
    }

    this.subject$.next(query);
    const result = await handler.execute(query);
    return result as TResult;
  }

  bind<T extends QueryBase, TResult = any>(
    handler: IQueryHandler<T, TResult>,
    queryId: string,
  ) {
    if (this.handlers.has(queryId)) {
      const queryName = reflectQueryName(
        handler.constructor as QueryHandlerType,
      );
      // as we already have commandId then commandName should be reachable
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      throw new QueryHandlerAlreadyAssignedException(queryName!);
    }
    this.handlers.set(queryId, handler);
  }

  register(handlers: QueryHandlerType<QueryBase>[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  protected registerHandler(handler: QueryHandlerType<QueryBase>) {
    const instance = this.moduleRef.get(handler, { strict: false });
    if (!instance) {
      return;
    }
    const target = reflectQueryId(handler);
    if (!target) {
      throw new InvalidQueryHandlerException();
    }
    this.bind(instance as IQueryHandler<QueryBase, IQueryResult>, target);
  }

  private useDefaultPublisher() {
    this._publisher = new DefaultQueryPubSub<QueryBase>(this.subject$);
  }
}
