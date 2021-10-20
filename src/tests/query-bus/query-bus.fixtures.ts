import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '../../query-bus';
import { ExplorerService } from '../../services/explorer.service';
import { SomeQueryHandler } from './some-query.handler';
import { SomeQuery } from './some-query';
import { SomeQueryDuplicateHandler } from './some-query-duplicate.handler';

export const getFixtures = () => {
  let module: TestingModule;
  let queryBus: QueryBus;
  return {
    GivenThereIsOneCommand: async () => {
      module = await Test.createTestingModule({
        providers: [QueryBus, ExplorerService, SomeQueryHandler],
      }).compile();

      queryBus = await module.resolve(QueryBus);
      const explorer = await module.resolve(ExplorerService);
      const { queries } = explorer.explore();
      queryBus.register(queries);
    },
    WhenTheQueryIsExecuted: async () => {
      return queryBus.execute(new SomeQuery());
    },
    ThenItShouldReturnTheResultFromHandler: (result) => {
      expect(result).toBe(0);
    },
    GivenThereAreTwoQueriesWithTheSameName: async () => {
      module = await Test.createTestingModule({
        providers: [
          QueryBus,
          ExplorerService,
          SomeQueryHandler,
          SomeQueryDuplicateHandler,
        ],
      }).compile();

      queryBus = await module.resolve(QueryBus);
      const explorer = await module.resolve(ExplorerService);
      const { queries } = explorer.explore();
      queryBus.register(queries);
    },
  };
};
