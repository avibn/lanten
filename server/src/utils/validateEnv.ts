import { port, str, url } from "envalid/dist/validators";

import { cleanEnv } from "envalid";

export default cleanEnv(process.env, {
    PORT: port(),
    REDIS_URL: url(),
    SESSION_SECRET: str(),
    CLIENT_URL: url(),
});
