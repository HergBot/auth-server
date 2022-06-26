import { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";

import sessionController from "../controllers/session.controller";
import logger from "../lib/console-logger";
import {
  SessionActionResponse,
  SessionUpdateResponse,
} from "../routes/v1/session.routes";
import { parseDate } from "../utils/common.utils";
import { validateSessionExpiry } from "../utils/session.utils";
import { UserAuthenticatedResponse } from "./authentication.middleware";

export const authorizeForSession = async (
  req: Request,
  res: UserAuthenticatedResponse,
  next: NextFunction
): Promise<SessionActionResponse | void> => {
  if (isNil(res.locals.user)) {
    logger.error(
      `Authorizing for session with missing locals. user: ${res.locals.user}`
    );
    return res.status(500).send();
  }

  const sessionId = req.params.sessionId;
  // Make sure the session exists
  const session = await sessionController.find(sessionId);
  if (isNil(session)) {
    const status = session === undefined ? 500 : 404;
    return res.status(status).send();
  }

  if (res.locals.user.User_Id !== session.User_Id) {
    logger.warning(
      `User ${res.locals.user.User_Id} tried to update a session that isn't theirs: ${res.locals.sessionId}`
    );
    return res.status(403).send();
  }

  res.locals.session = session;
  return next();
};

export const validateSessionUpdate = async (
  req: Request,
  res: SessionActionResponse,
  next: NextFunction
): Promise<SessionUpdateResponse | void> => {
  if (isNil(res.locals.session)) {
    logger.error(
      `Validating for session update  with missing locals. sessionId: ${res.locals.sessionId}`
    );
    return res.status(500).send();
  }
  const refreshToken = req.body.refreshToken;
  const expires = parseDate(req.body.expires);

  if (isNil(refreshToken)) {
    return res.status(400).send();
  }

  if (!isNil(expires) && !validateSessionExpiry(expires)) {
    return res.status(400).send();
  }

  res.locals.refreshToken = refreshToken;
  res.locals.expires = expires;
  return next();
};

export const authorizeForSessionUpdate = async (
  req: Request,
  res: SessionUpdateResponse,
  next: NextFunction
): Promise<SessionUpdateResponse | void> => {
  if (
    isNil(res.locals.user) ||
    isNil(res.locals.session) ||
    isNil(res.locals.refreshToken)
  ) {
    logger.error(
      `Authorizing for session with missing locals. user: ${res.locals.user}, session: ${res.locals.session}, refreshToken: ${res.locals.refreshToken}`
    );
    return res.status(500).send();
  }

  if (res.locals.refreshToken !== res.locals.session.Refresh_Token) {
    logger.warning(
      `User ${res.locals.user.User_Id} tried to update a session with the wrong refresh token: ${res.locals.refreshToken}`
    );
    return res.status(403).send();
  }

  return next();
};
