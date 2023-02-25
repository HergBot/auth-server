import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";
import musqrat from "musqrat";

import serverLog from "./lib/console-logger";
import v1Router, { V1_ROUTER_ROOT } from "./routes/v1";

async function main(): Promise<void> {
  const envConfig = dotenv.config();
  if (!isNil(envConfig.error) || isNil(envConfig.parsed)) {
    serverLog.error(`Failed to load the env config file`, "main");
    return;
  }
  serverLog.info("Successfully loaded the env config", "main");

  try {
    musqrat.connect({
      user: envConfig.parsed.SQL_USER,
      password: envConfig.parsed.SQL_PASSWORD,
      host: envConfig.parsed.SQL_HOST,
      database: envConfig.parsed.SQL_DATABASE,
    });
  } catch (err) {
    serverLog.error("Error connecting to the database", "main");
    serverLog.exception(err as Error);
    return;
  }

  if (!musqrat.connected) {
    serverLog.error("Failed to connect to database", "main");
    return;
  }
  const withPassword = isNil(envConfig.parsed.SQL_PASSWORD) ? "No" : "Yes";
  serverLog.info(
    `Successfully connected to the database ${envConfig.parsed.SQL_DATABASE} with ${envConfig.parsed.SQL_USER}@${envConfig.parsed.SQL_HOST} (with Password: ${withPassword})`,
    "main"
  );

  const app = express();
  const PORT = envConfig.parsed.PORT;

  app.use(express.json());

  app.listen(PORT, () => {
    serverLog.info(`Server is running at https://localhost:${PORT}`, "main");
  });

  // Register routes
  app.use(V1_ROUTER_ROOT, v1Router);

  // Error handling
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).send("Internal Server Error");
  });
}

main();
