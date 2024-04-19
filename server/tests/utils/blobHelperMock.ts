jest.mock("../../src/azure/blobs/blobHelper", () => ({
    uploadFile: jest.fn().mockResolvedValue({
        url: "https://blobstorage.com/container/blob",
        fileName: "blob",
    }),
    deleteBlob: jest.fn().mockResolvedValue(undefined),
    getTemporaryBlobUrl: jest
        .fn()
        .mockResolvedValue("https://blobstorage.com/container/blob?sasToken"),
}));
