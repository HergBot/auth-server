import dotenv from "dotenv";
import express from "express";

import sessionRouter, { SESSION_ROUTER_ROOT } from "./routes/v1/session.routes";

const envConfig = dotenv.config();
console.log(envConfig);
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

app.use(SESSION_ROUTER_ROOT, sessionRouter);
