import { Type } from '@nestjs/common';
import { IQuery } from '../interfaces';
import {
  QUERY_HANDLER_METADATA,
  QUERY_METADATA,
} from '../decorators/constants';
import { QueryHandlerType } from '../query-bus';
import { QueryMetadata } from '../interfaces/queries/query-metadata.interface';

export const reflectQuery = (handler: QueryHandlerType): Type<IQuery> => {
  return Reflect.getMetadata(QUERY_HANDLER_METADATA, handler);
};
export const reflectQueryId = (
  handler: QueryHandlerType,
): string | undefined => {
  const query = reflectQuery(handler);
  const queryMetadata: QueryMetadata = Reflect.getMetadata(
    QUERY_METADATA,
    query,
  );
  return queryMetadata.id;
};

export const reflectQueryName = (
  handler: QueryHandlerType,
): string | undefined => {
  const query = reflectQuery(handler);
  return query.name;
};

export const getQueryId = (query: Type<IQuery>): string => {
  const queryMetadata: QueryMetadata = Reflect.getMetadata(
    QUERY_METADATA,
    query,
  );

  return queryMetadata.id;
};
