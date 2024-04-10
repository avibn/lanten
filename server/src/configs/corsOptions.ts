import cors from "cors";
import env from "../utils/validateEnv";

console.log("env.CLIENT_URL", env.CLIENT_URL);

// CORS
export const corsOptions: cors.CorsOptions = {
    origin: env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
};
