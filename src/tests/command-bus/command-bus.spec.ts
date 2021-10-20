import { getFixtures } from './command-bus.fixutres';

describe('Command Bus', () => {
  const fixtures = getFixtures();

  it('should execute and return result from the command handler', async () => {
    await fixtures.GivenThereIsOneCommand();
    const result = await fixtures.WhenTheQueryIsExecuted();
    fixtures.ThenItShouldReturnTheResultFromHandler(result);
  });

  it('should distinguish between commands with the same name ', async () => {
    await fixtures.GivenThereAreTwoCommandsWithTheSameName();
    const result = await fixtures.WhenTheQueryIsExecuted();
    fixtures.ThenItShouldReturnTheResultFromHandler(result);
  });
});
