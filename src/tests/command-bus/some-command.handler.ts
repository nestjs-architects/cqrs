import { CommandHandler } from '../../decorators';
import { SomeCommand } from './some.command';
import { ICommandHandler } from '../../interfaces';

@CommandHandler(SomeCommand)
export class SomeCommandHandler implements ICommandHandler<SomeCommand> {
  execute(command: SomeCommand): Promise<number> {
    return Promise.resolve(5);
  }
}
