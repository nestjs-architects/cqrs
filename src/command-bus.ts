import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import 'reflect-metadata';
import { CommandHandlerNotFoundException } from './exceptions/command-not-found.exception';
import { DefaultCommandPubSub } from './helpers/default-command-pubsub';
import { InvalidCommandHandlerException } from './exceptions/invalid-command-handler.exception';
import {
  Command,
  ICommand,
  ICommandBus,
  ICommandHandler,
  ICommandPublisher,
} from './interfaces/index';
import { ObservableBus } from './utils/observable-bus';
import { CommandHandlerAlreadyAssignedException } from './exceptions/command-handler-already-assigned.exception';
import {
  getCommandId,
  reflectCommandId,
  reflectCommandName,
} from './helpers/reflect-command-bus';

export type CommandHandlerType = Type<ICommandHandler<ICommand>>;

@Injectable()
export class CommandBus<CommandBase extends ICommand = ICommand>
  extends ObservableBus<CommandBase>
  implements ICommandBus<CommandBase>
{
  private handlers = new Map<string, ICommandHandler<CommandBase>>();
  private _publisher!: ICommandPublisher<CommandBase>;

  constructor(private readonly moduleRef: ModuleRef) {
    super();
    this.useDefaultPublisher();
  }

  get publisher(): ICommandPublisher<CommandBase> {
    return this._publisher;
  }

  set publisher(_publisher: ICommandPublisher<CommandBase>) {
    this._publisher = _publisher;
  }

  execute<R = void>(query: Command<R>): Promise<R>;
  execute<T extends CommandBase, R = any>(command: T): Promise<R>;
  execute<T extends CommandBase, R = any>(command: T): Promise<R> {
    const commandId = getCommandId(command.constructor as Type<ICommand>);
    const handler = this.handlers.get(commandId);
    if (!handler) {
      throw new CommandHandlerNotFoundException(commandId);
    }
    this.subject$.next(command);
    return handler.execute(command);
  }

  bind<T extends CommandBase>(handler: ICommandHandler<T>, commandId: string) {
    if (this.handlers.has(commandId)) {
      const commandName = reflectCommandName(
        handler.constructor as CommandHandlerType,
      );
      // as we already have commandId then commandName should be reachable
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      throw new CommandHandlerAlreadyAssignedException(commandName!);
    }
    this.handlers.set(commandId, handler);
  }

  register(handlers: CommandHandlerType[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  protected registerHandler(handler: CommandHandlerType) {
    const instance = this.moduleRef.get(handler, { strict: false });
    if (!instance) {
      return;
    }
    const target = reflectCommandId(handler);
    if (!target) {
      throw new InvalidCommandHandlerException();
    }
    this.bind(instance as ICommandHandler<CommandBase>, target);
  }

  private useDefaultPublisher() {
    this._publisher = new DefaultCommandPubSub<CommandBase>(this.subject$);
  }
}
