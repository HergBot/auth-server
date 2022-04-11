import { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";

import sessionController from "../controllers/session.controller";
import logger from "../lib/console-logger";
import { SessionUpdateResponse } from "../routes/v1/session.routes";
import { parseDate } from "../utils/common.utils";
import { validateSessionExpiry } from "../utils/session.utils";
import { AuthenticatedResponse } from "./authentication.middleware";

export const validateSessionUpdate = async (
  req: Request,
  res: AuthenticatedResponse,
  next: NextFunction
): Promise<SessionUpdateResponse | void> => {
  const sessionId = req.params.sessionId;
  const refreshToken = req.body.refreshToken;
  const expires = parseDate(req.body.expires);

  if (isNil(sessionId)) {
    return res.status(404).send();
  } else if (isNil(refreshToken) || isNil(expires)) {
    return res.status(400).send();
  }

  if (validateSessionExpiry(expires)) {
    return res.status(400).send();
  }

  res.locals.sessionId = sessionId;
  res.locals.refreshToken = refreshToken;
  res.locals.expires = expires;
  return next();
};

export const authorizeForSession = async (
  req: Request,
  res: SessionUpdateResponse,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | void> => {
  if (
    isNil(res.locals.user) ||
    isNil(res.locals.sessionId) ||
    isNil(res.locals.refreshToken)
  ) {
    logger.error(
      `Authorizing for session with missing locals. user: ${res.locals.user}, sessionId: ${res.locals.sessionId}, refreshToken: ${res.locals.refreshToken}`
    );
    return res.status(500).send();
  }

  // Make sure the session exists
  const session = await sessionController.find(res.locals.sessionId);
  if (isNil(session)) {
    const status = session === undefined ? 500 : 404;
    return res.status(status).send();
  }

  if (res.locals.user.User_Id !== session.User_Id) {
    logger.warning(
      `User ${res.locals.user.User_Id} tried to update a session that isn't theirs: ${res.locals.sessionId}`
    );
    return res.status(403).send();
  } else if (res.locals.refreshToken !== session.Refresh_Token) {
    logger.warning(
      `User ${res.locals.user.User_Id} tried to update a session with the wrong refresh token: ${res.locals.refreshToken}`
    );
    return res.status(403).send();
  }

  return next();
};
