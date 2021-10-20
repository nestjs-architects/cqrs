import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '../../command-bus';
import { ExplorerService } from '../../services/explorer.service';
import { SomeCommandHandler } from './some-command.handler';
import { SomeCommand } from './some.command';
import { SomeCommandDuplicateHandler } from './some-command-duplicate.handler';
import { SomeCommandSecondHandler } from './some-command-second.handler';

export const getFixtures = () => {
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
    WhenTheQueryIsExecuted: async () => {
      return commandBus.execute(new SomeCommand());
    },
    ThenItShouldReturnTheResultFromHandler: (result) => {
      expect(result).toBe(5);
    },
    GivenThereAreTwoCommandsWithTheSameName: async () => {
      module = await Test.createTestingModule({
        providers: [
          CommandBus,
          ExplorerService,
          SomeCommandHandler,
          SomeCommandDuplicateHandler,
        ],
      }).compile();

      commandBus = await module.resolve(CommandBus);
      const explorer = await module.resolve(ExplorerService);
      const { commands } = explorer.explore();
      commandBus.register(commands);
    },
    async WhenAssigningMultipleHandlersForTheSameAction(): Promise<Error> {
      try {
        module = await Test.createTestingModule({
          providers: [
            CommandBus,
            ExplorerService,
            SomeCommandHandler,
            SomeCommandSecondHandler,
          ],
        }).compile();

        commandBus = await module.resolve(CommandBus);
        const explorer = await module.resolve(ExplorerService);
        const { commands } = explorer.explore();
        commandBus.register(commands);
        return null;
      } catch (e) {
        return e;
      }
    },
    ThenItShouldProduceAnError(result: Error) {
      expect(result).toBeInstanceOf(Error);
    },
  };
};
