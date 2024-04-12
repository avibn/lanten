import { port, str, url } from "envalid/dist/validators";

import { cleanEnv } from "envalid";

export default cleanEnv(process.env, {
    PORT: port(),
    REDIS_URL: url(),
    SESSION_SECRET: str(),
    CLIENT_URL: url(),
    AZURE_FUNCTION_URL: url(),
    AZURE_FUNCTION_TOKEN: str(),
    AZURE_STORAGE_CONNECTION_STRING: str(),
    DOCUMENT_BLOB_CONTAINER: str(),
    MAINTENANCE_BLOB_CONTAINER: str(),
    PROPERTY_BLOB_CONTAINER: str(),
    NODE_ENV: str({ default: "development" }),
    EXPRESS_SECRET_KEY: str(),
});
