jest.mock("../../src/utils/validateEnv", () => ({
  AZURE_FUNCTION_TOKEN: 'randomAzureFunctionToken',
  AZURE_FUNCTION_URL: 'http://random.azure.function.url',
  AZURE_STORAGE_CONNECTION_STRING: 'DefaultEndpointsProtocol=https;AccountName=random;AccountKey=random;EndpointSuffix=core.windows.net',
  CLIENT_URL: 'http://random.client.url',
  DOCUMENT_BLOB_CONTAINER: 'randomDocumentBlobContainer',
  EXPRESS_SECRET_KEY: 'randomExpressSecretKey',
  MAINTENANCE_BLOB_CONTAINER: 'randomMaintenanceBlobContainer',
  PORT: '3000',
  PROPERTY_BLOB_CONTAINER: 'randomPropertyBlobContainer',
  REDIS_URL: 'redis://random.redis.url:6379',
  SESSION_SECRET: 'randomSessionSecret',
}));