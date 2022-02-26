import dotenv from "dotenv";
import express from "express";
import { isNil } from "lodash";
import musqrat from "musqrat";

import sessionRouter, { SESSION_ROUTER_ROOT } from "./routes/v1/session.routes";

async function main() {
    const envConfig = dotenv.config();
    if (!isNil(envConfig.error) || isNil(envConfig.parsed)) {
        console.error(`[SERVER]: Failed to load the env config file`);
        return;
    }

    console.log("hi");

    musqrat.connect({
        user: envConfig.parsed.SQL_USER,
        password: envConfig.parsed.SQL_PASSWORD,
        host: envConfig.parsed.SQL_HOST,
        database: envConfig.parsed.SQL_DATABASE,
    });

    const app = express();
    const PORT = envConfig.parsed.SQL_DATABASE;

    app.use(express.json());

    app.listen(PORT, () => {
        console.log(`[SERVER]: Server is running at https://localhost:${PORT}`);
    });

    app.use(SESSION_ROUTER_ROOT, sessionRouter);
}

main();
