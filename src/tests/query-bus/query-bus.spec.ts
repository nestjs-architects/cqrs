import { getFixtures } from './query-bus.fixtures';

describe('Query Bus', () => {
  const fixtures = getFixtures();

  it('should return the result from handler for the query', async () => {
    await fixtures.GivenThereIsOneCommand();
    const result = await fixtures.WhenTheQueryIsExecuted();
    fixtures.ThenItShouldReturnTheResultFromHandler(result);
  });

  it('should distinguish between commands with the same name ', async () => {
    await fixtures.GivenThereAreTwoQueriesWithTheSameName();
    const result = await fixtures.WhenTheQueryIsExecuted();
    fixtures.ThenItShouldReturnTheResultFromHandler(result);
  });

  it('should be impossible to register multiple handlers to the same command', async () => {
    const result =
      await fixtures.WhenAssigningMultipleHandlersForTheSameAction();
    fixtures.ThenItShouldProduceAnError(result);
  });
});
