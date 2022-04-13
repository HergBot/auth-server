import { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";

import sessionController from "../controllers/session.controller";
import userController from "../controllers/user.controller";
import logger from "../lib/console-logger";
import { IUser } from "../schemas/user.schema";

export interface AuthenticatedLocals extends Record<string, any> {
  user?: IUser;
}

export interface AuthenticatedResponse extends Response {
  locals: AuthenticatedLocals;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AuthenticatedResponse | void> => {
  if (isNil(req.headers)) {
    logger.info(`'${req.path}' was hit without any headers`);
    return res.status(403).send();
  }

  // Check if token exists
  const token = req.headers.authorization;
  if (isNil(token)) {
    logger.info(`'${req.path}' was hit without a token`);
    return res.status(403).send();
  }

  // Find and check session
  const now = new Date();
  const session = await sessionController.find(token);
  if (isNil(session)) {
    if (session === undefined) {
      logger.error(`Error finding the session for token '${token}'`);
      return res.status(500).send();
    }
    logger.info(`No session found for token '${token}'`);
    return res.status(401).send();
  } else if (!isNil(session.Deactivated)) {
    logger.info(
      `Session for token '${token}' has been deactivated at ${session.Deactivated}`
    );
    return res.status(401).send();
  } else if (session.Expires.valueOf() <= now.valueOf()) {
    logger.info(`Session for token '${token}' expired at ${session.Expires}`);
    return res.status(401).send();
  }

  // Find user attached to session
  const user = await userController.find(session.User_Id);
  if (isNil(user)) {
    if (user === undefined) {
      logger.error(
        `Error finding the user with id ${session.User_Id} for token ${token}`
      );
      return res.status(500).send();
    }
    logger.warning(`No user for with id ${session.User_Id} for token ${token}`);
    return res.status(401).send();
  } else if (!isNil(user.Deactivated)) {
    logger.info(
      `User with id ${user.User_Id} has been deactivated at ${user.Deactivated} (token: ${token})`
    );
    return res.status(403).send();
  }

  res.locals.user = user;
  return next();
};

export const authenticateHergBotAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AuthenticatedResponse | void> => {
  // Check if the user locals value exists
  // Check if the user belongs to the Herg Bot Auth Service
  // Check if the user has an admin role
};

export const authenticateServiceId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  // Check if the service id header exists
  // Check if the service exists
  // Attach service to locals
};

export const authenticateServiceToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  // Check if the service locals value exists
  // Check if the service token header exists
  // Check if the given token matches the service in locals
};

export const authenticateUserForService = async (
  req: Request,
  res: AuthenticatedResponse,
  next: NextFunction
): Promise<AuthenticatedResponse | void> => {
  // Check if the user and service locals value exists
  // Check if the user service matches the service's id
};
