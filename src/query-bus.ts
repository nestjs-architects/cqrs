import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import 'reflect-metadata';
import { QUERY_HANDLER_METADATA } from './decorators/constants';
import { QueryHandlerNotFoundException } from './exceptions';
import { InvalidQueryHandlerException } from './exceptions/invalid-query-handler.exception';
import { DefaultQueryPubSub } from './helpers/default-query-pubsub';
import { IQueryBus, IQueryHandler, IQueryPublisher, Query } from './interfaces';
import { ObservableBus } from './utils/observable-bus';

type QueryBase = Query<unknown>;
type QueryHandlerType<QueryType extends Query<unknown>> = Type<
  IQueryHandler<QueryType>
>;

@Injectable()
export class QueryBus extends ObservableBus<QueryBase> implements IQueryBus {
  private handlers = new Map<string, IQueryHandler<QueryBase>>();
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

  async execute<TResult = unknown>(query: Query<TResult>): Promise<TResult> {
    const queryName = this.getQueryName(query);
    const handler = this.handlers.get(queryName);
    if (!handler) {
      throw new QueryHandlerNotFoundException(queryName);
    }

    this.subject$.next(query);
    const result = await handler.execute(query);
    return result as TResult;
  }

  bind<T extends QueryBase>(handler: IQueryHandler<T>, name: string) {
    this.handlers.set(name, handler);
  }

  register(handlers: QueryHandlerType<QueryBase>[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  protected registerHandler(handler: QueryHandlerType<QueryBase>) {
    const instance = this.moduleRef.get(handler, { strict: false });
    if (!instance) {
      return;
    }
    const target = this.reflectQueryName(handler);
    if (!target) {
      throw new InvalidQueryHandlerException();
    }
    this.bind(instance as IQueryHandler<QueryBase>, target.name);
  }

  private getQueryName(query: QueryBase): string {
    const { constructor } = Object.getPrototypeOf(query);
    return constructor.name as string;
  }

  private reflectQueryName(
    handler: QueryHandlerType<QueryBase>,
  ): FunctionConstructor {
    return Reflect.getMetadata(QUERY_HANDLER_METADATA, handler);
  }

  private useDefaultPublisher() {
    this._publisher = new DefaultQueryPubSub<QueryBase>(this.subject$);
  }
}
