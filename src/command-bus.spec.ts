import { Command, ICommandHandler } from './interfaces';
import { CommandHandler } from './decorators';
import { Test, TestingModule } from '@nestjs/testing';
import { ExplorerService } from './services/explorer.service';
import { CommandBus } from './command-bus';

class SomeCommand extends Command<number> {}

@CommandHandler(SomeCommand)
class SomeCommandHandler implements ICommandHandler<SomeCommand> {
  execute(command: SomeCommand): Promise<number> {
    return Promise.resolve(5);
  }
}

const getFixtures = () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  return {
    GivenThereIsOneCommand: async () => {
      module = await Test.createTestingModule({
        providers: [CommandBus, ExplorerService, SomeCommandHandler],
      }).compile();

      commandBus = await module.resolve(CommandBus);
      const explorer = await module.resolve(ExplorerService);
      const { commands } = explorer.explore();
      commandBus.register(commands);
    },
    WhenTheCommandIsExecuted: async () => {
      return commandBus.execute(new SomeCommand());
    },
    ThenItShouldReturnTheResultFromHandler: (result) => {
      expect(result).toBe(5);
    },
  };
};

describe('Command Bus', () => {
  const fixtures = getFixtures();

  it('should execute and return result from the command handler', async () => {
    await fixtures.GivenThereIsOneCommand();
    const result = await fixtures.WhenTheCommandIsExecuted();
    fixtures.ThenItShouldReturnTheResultFromHandler(result);
  });
});
