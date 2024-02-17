import cors from "cors";
import env from "../utils/validateEnv";

// CORS
export const corsOptions: cors.CorsOptions = {
    origin: env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
};
