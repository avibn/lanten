jest.mock("../../src/azure/functions", () => ({
    emailInvite: jest.fn().mockResolvedValue(undefined),
    emailAnnouncement: jest.fn().mockResolvedValue(undefined),
}));
