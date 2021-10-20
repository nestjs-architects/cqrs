export class QueryHandlerAlreadyAssignedException extends Error {
  constructor(queryName: string) {
    super(`Query ${queryName} already have a handler`);
  }
}
