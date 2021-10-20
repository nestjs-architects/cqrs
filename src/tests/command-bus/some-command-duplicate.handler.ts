import { CommandHandler } from '../../decorators';
import { ICommandHandler } from '../../interfaces';
import { SomeCommand } from './some-command-duplicate';

@CommandHandler(SomeCommand)
export class SomeCommandDuplicateHandler
  implements ICommandHandler<SomeCommand>
{
  execute(command: SomeCommand): Promise<number> {
    return Promise.resolve(6);
  }
}
