import logger from "../lib/console-logger";
import { ILogger } from "../lib/logger";
import Session, { ISession } from "../schemas/session.schema";
import DeactivateController from "./common/deactivate.controller";

export const SESSION_LENGTH = 4; // 4 Hours
export const MAX_SESSION_LENGTH = 24; // 24 Hours

class SessionController extends DeactivateController<
  ISession,
  "Session_Id",
  "Deactivated"
> {
  constructor(logger: ILogger) {
    super(logger, Session, "Session_Id", "Deactivated");
  }
}

export default new SessionController(logger);
