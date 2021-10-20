import { IQueryHandler, Query } from './interfaces';
import { QueryHandler } from './decorators';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from './query-bus';
import { ExplorerService } from './services/explorer.service';

class SomeQuery extends Query<number> {}

@QueryHandler(SomeQuery)
class SomeQueryHandler implements IQueryHandler<SomeQuery> {
  execute(query: SomeQuery): Promise<number> {
    return Promise.resolve(0);
  }
}

const getFixtures = () => {
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
    WhenTheCommandIsExecuted: async () => {
      return queryBus.execute(new SomeQuery());
    },
    ThenItShouldReturnTheResultFromHandler: (result) => {
      expect(result).toBe(0);
    },
  };
};

describe('Query Bus', () => {
  const fixtures = getFixtures();

  it('should return the result from handler for the query', async () => {
    await fixtures.GivenThereIsOneCommand();
    const result = await fixtures.WhenTheCommandIsExecuted();
    fixtures.ThenItShouldReturnTheResultFromHandler(result);
  });
});
