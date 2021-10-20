import 'reflect-metadata';
import { Query } from '../interfaces';
import { QUERY_HANDLER_METADATA } from './constants';
import { Type } from '@nestjs/common';

/**
 * Decorator that marks a class as a Nest query handler. A query handler
 * handles queries executed by your application code.
 *
 * The decorated class must implement the `IQueryHandler` interface.
 *
 * @param query query *type* to be handled by this handler.
 *
 * @see https://docs.nestjs.com/recipes/cqrs#queries
 */
export const QueryHandler = (query: Type<Query<unknown>>): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(QUERY_HANDLER_METADATA, query, target);
  };
};
