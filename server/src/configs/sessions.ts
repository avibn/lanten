import RedisStore from "connect-redis";
import { createClient } from "redis";
import env from "../utils/validateEnv";
import session from "express-session";

// Create redis client
const redisClient = createClient({
    url: env.REDIS_URL,
});
redisClient.connect().catch(console.error);

// Initialize redis store
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "lanten:",
});

export const sessionMiddleware = session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: env.SESSION_SECRET,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 5, // 15 days
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    },
});
