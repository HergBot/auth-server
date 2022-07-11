import { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";
import {
  HERGBOT_AUTH_SERVICE_ADMIN_ROLE_ID,
  HERGBOT_AUTH_SERVICE_ID,
} from "../constants/environment.constants";
import { HEADERS, STATUSES } from "../constants/request.constants";
import serviceTokenController from "../controllers/service-token.controller";
import serviceController from "../controllers/service.controller";

import sessionController from "../controllers/session.controller";
import userRoleController from "../controllers/user-role.controller";
import userController from "../controllers/user.controller";
import logger from "../lib/console-logger";
import { IService } from "../schemas/service.schema";
import { IUser } from "../schemas/user.schema";
import { anyHeaders, hasHeader } from "../utils/middleware.utils";

export interface ServiceAuthenticatedLocals extends Record<string, any> {
  service?: IService;
}

export interface ServiceAuthenticatedResponse extends Response {
  locals: ServiceAuthenticatedLocals;
}

export interface UserAuthenticatedLocals extends Record<string, any> {
  user?: IUser;
}

export interface UserAuthenticatedResponse extends Response {
  locals: UserAuthenticatedLocals;
}

export const getUserTokenData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if authorization header exists
  if (!anyHeaders(req)) {
    logger.info(`'${req.path}' was hit without any headers`);
    return res.status(403).send();
  } else if (!hasHeader(req, HEADERS.AUTHORIZATION)) {
    logger.info(`'${req.path}' was hit without an authorization header`);
    return res.status(403).send();
  }

  // Query for session, user, and service
  const token = req.get(HEADERS.AUTHORIZATION) || "";
  // TODO: Make a way to query session, user, and service info in one call. Do the same for a getServiceTokenData function
  // so we can take all queries out of middleware where possible.
  // Check if the user is with the Herg Bot Auth Service and is an admin
};

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<UserAuthenticatedResponse | void> => {
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
    // TODO: Change this to return 500 for either undefined or null, just log different error messages (the user should not be missing ever because it is tied to the session).
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
  res: UserAuthenticatedResponse,
  next: NextFunction
): Promise<UserAuthenticatedResponse | void> => {
  // Check if the user locals value exists
  if (isNil(res.locals.user)) {
    logger.warning(`Admin end point '${req.path}' was hit without user data`);
    return res.status(500).send();
  }

  // Check if the user belongs to the Herg Bot Auth Service
  if (res.locals.user.Service_Id !== HERGBOT_AUTH_SERVICE_ID) {
    logger.warning(
      `Admin end point '${req.path}' was hit by non-admin user '${res.locals.user.User_Id}'`
    );
    return res.status(403).send();
  }

  // Check if the user has an admin role
  const userRole = await userRoleController.find(
    res.locals.user.User_Id,
    HERGBOT_AUTH_SERVICE_ADMIN_ROLE_ID
  );
  if (isNil(userRole)) {
    if (userRole === undefined) {
      logger.error(
        `Error finding the HergBot Admin Service Admin Role with user id ${res.locals.user.User_Id}`
      );
      return res.status(500).send();
    }
    logger.warning(
      `Admin end point '${req.path}' was hit by admin user '${res.locals.user.User_Id}' but lacked admin role`
    );
    return res.status(403).send();
  }

  // User must have the admin role
  return next();
};

export const authenticateServiceToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ServiceAuthenticatedResponse | void> => {
  // Check if the service token header exists
  if (!anyHeaders(req)) {
    logger.info(`'${req.path}' was hit without any headers`);
    return res.status(403).send();
  } else if (!hasHeader(req, HEADERS.HERGBOT_SERVICE_TOKEN)) {
    logger.info(`'${req.path}' was hit without a service token`);
    return res.status(403).send();
  }

  // Check if the service token exists
  const now = new Date();
  const serviceTokenHeader = req.get(HEADERS.HERGBOT_SERVICE_TOKEN) || "";
  const serviceToken = await serviceTokenController.find(serviceTokenHeader);
  if (isNil(serviceToken)) {
    if (serviceToken === undefined) {
      logger.error(
        `Error finding the service token with id ${serviceToken} for endpoint '${req.path}'`
      );
      return res.status(500).send();
    }
    logger.warning(
      `No service token with id ${serviceToken} for endpoint '${req.path}'`
    );
    return res.status(403).send();
  } else if (!isNil(serviceToken.Deactivated)) {
    logger.info(
      `Service token with id ${serviceToken} has been deactivated at ${serviceToken.Deactivated} (endpoint '${req.path}')`
    );
    return res.status(403).send();
  } else if (
    !isNil(serviceToken.Expires) &&
    serviceToken.Expires.valueOf() <= now.valueOf()
  ) {
    logger.info(
      `Service token '${serviceToken}' expired at ${serviceToken.Expires}`
    );
    return res.status(401).send();
  }

  // Get the service
  const service = await serviceController.find(serviceToken.Service_Id);
  if (isNil(service)) {
    if (service === undefined) {
      logger.error(
        `Error finding the service with id ${serviceToken.Service_Id} with service token ${serviceToken.Service_Token_Id} for endpoint '${req.path}'`
      );
      return res.status(500).send();
    }
    logger.warning(
      `No service with id ${serviceToken.Service_Id} with service token ${serviceToken.Service_Token_Id} for endpoint '${req.path}'`
    );
    return res.status(403).send();
  } else if (!isNil(service.Deactivated)) {
    logger.info(
      `Service with id ${serviceToken.Service_Id} with service token ${serviceToken.Service_Token_Id} has been deactivated at ${service.Deactivated} (endpoint '${req.path}')`
    );
    return res.status(403).send();
  }

  // Attach service to locals
  res.locals.service = service;
  return next();
};

export const authenticateServiceForService = async (
  req: Request,
  res: ServiceAuthenticatedResponse,
  next: NextFunction
): Promise<ServiceAuthenticatedResponse | void> => {
  const requestingServiceId = res.locals.service?.Service_Id;
  const targetServiceId = req.body?.serviceId;
  if (isNil(requestingServiceId)) {
    logger.info(`'${req.path}' was hit without a requesting service id`);
    return res.status(403).send();
  } else if (isNil(targetServiceId)) {
    logger.info(`'${req.path}' was hit without a target service id`);
    return res.status(403).send();
  }

  if (requestingServiceId !== targetServiceId) {
    logger.warning(
      `'${req.path}' was hit by service id '${requestingServiceId}' targeting service id '${targetServiceId}'`
    );
    return res.status(403).send();
  }

  return next();
};

export const authenticateServiceForUser = async (
  req: Request,
  res: ServiceAuthenticatedResponse & UserAuthenticatedResponse,
  next: NextFunction
): Promise<ServiceAuthenticatedResponse | void> => {
  const requestingServiceId = res.locals.service?.Service_Id;
  const targetServiceId = res.locals.user?.Service_Id;
  if (isNil(requestingServiceId)) {
    logger.info(`'${req.path}' was hit without a requesting service id`);
    return res.status(STATUSES.FORBIDDEN).send();
  } else if (isNil(targetServiceId)) {
    logger.info(
      `'${req.path}' was hit without a target service id from a user`
    );
    return res.status(STATUSES.FORBIDDEN).send();
  }

  if (requestingServiceId !== targetServiceId) {
    logger.warning(
      `'${req.path}' was hit by service id '${requestingServiceId}' targeting service id '${targetServiceId}' from user id '${res.locals.user?.User_Id}'`
    );
    return res.status(STATUSES.FORBIDDEN).send();
  }

  return next();
};

export const authenticateUserForService = async (
  req: Request,
  res: UserAuthenticatedResponse,
  next: NextFunction
): Promise<UserAuthenticatedResponse | void> => {
  // Check if the user and service locals value exists
  // Check if the user service matches the service's id
};
