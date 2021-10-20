import { Type } from '@nestjs/common';
import { ICommandHandler } from './commands/command-handler.interface';
import { IEventHandler } from './events/event-handler.interface';
import { IQueryHandler } from './queries/query-handler.interface';
import { IQuery } from './queries/query.interface';
import { ICommand } from './commands/command.interface';

export interface CqrsOptions {
  events?: Type<IEventHandler>[];
  queries?: Type<IQueryHandler<IQuery>>[];
  commands?: Type<ICommandHandler<ICommand>>[];
  sagas?: Type<any>[];
}
