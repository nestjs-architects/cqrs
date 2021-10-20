export class CommandHandlerAlreadyAssignedException extends Error {
  constructor(commandName: string) {
    super(`Command ${commandName} already have a handler`);
  }
}
