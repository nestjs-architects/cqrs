import { getFixtures } from './event-bus.fixtures';

describe('Event Bus', () => {
  const fixtures = getFixtures();

  it('should distinguish between events with the same name ', async () => {
    await fixtures.GivenThereAreTwoEventsWithTheSameName();
    fixtures.WhenTheEventIsDispatched();
    await fixtures.ThenOnlyHandlersRegisteredToThatEventAreExecuted();
  });
});
