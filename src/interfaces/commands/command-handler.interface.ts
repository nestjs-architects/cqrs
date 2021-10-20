import { Command, ICommand } from './command.interface';

export type ICommandHandler<
  CommandType extends ICommand,
  TRes = any,
> = CommandType extends Command<infer ResultType>
  ? BaseICommandHandler<CommandType, ResultType>
  : BaseICommandHandler<CommandType, TRes>;

interface BaseICommandHandler<TCommand extends ICommand = any, TResult = any> {
  execute(command: TCommand): Promise<TResult>;
}
