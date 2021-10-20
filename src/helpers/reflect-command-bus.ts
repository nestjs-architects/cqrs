import { Type } from '@nestjs/common';
import { ICommand } from '../interfaces';
import {
  COMMAND_HANDLER_METADATA,
  COMMAND_METADATA,
} from '../decorators/constants';
import { CommandMetadata } from '../interfaces/commands/command-metadata.interface';
import { CommandHandlerType } from '../command-bus';

export const reflectCommand = (handler: CommandHandlerType): Type<ICommand> => {
  return Reflect.getMetadata(COMMAND_HANDLER_METADATA, handler);
};
export const reflectCommandId = (
  handler: CommandHandlerType,
): string | undefined => {
  const command = reflectCommand(handler);
  const commandMetadata: CommandMetadata = Reflect.getMetadata(
    COMMAND_METADATA,
    command,
  );
  return commandMetadata.id;
};

export const reflectCommandName = (
  handler: CommandHandlerType,
): string | undefined => {
  const command = reflectCommand(handler);
  return command.name;
};

export const getCommandId = (command: Type<ICommand>): string => {
  const commandMetadata: CommandMetadata = Reflect.getMetadata(
    COMMAND_METADATA,
    command,
  );

  return commandMetadata.id;
};
