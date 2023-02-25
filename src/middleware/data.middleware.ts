import { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";

import { STATUSES } from "../constants/request.constants";
import serviceController from "../controllers/service.controller";
import userController from "../controllers/user.controller";
import logger from "../lib/console-logger";
import {
  ServiceAuthenticatedResponse,
  UserAuthenticatedResponse,
} from "../middleware/authentication.middleware";
import { getBinaryBody } from "../utils/middleware.utils";

export const attachUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<UserAuthenticatedResponse | void> => {
  const userId = getBinaryBody(req, "userId");
  if (isNil(userId)) {
    logger.info(`'${req.path}' was hit without a user id`);
    return res.status(STATUSES.BAD_REQUEST).send();
  }

  // Get the user
  const user = await userController.find(userId);
  if (isNil(user)) {
    if (user === undefined) {
      logger.error(
        `Error finding the user with id ${userId} for endpoint '${req.path}'`
      );
      return res.status(STATUSES.ERROR).send();
    }
    logger.warning(`No user with id ${userId} for endpoint '${req.path}'`);
    return res.status(STATUSES.UNPROCESSABLE).send();
  } else if (!isNil(user.Deactivated)) {
    logger.info(
      `User with id ${userId} has been deactivated at ${user.Deactivated} (endpoint '${req.path}')`
    );
    return res.status(STATUSES.UNPROCESSABLE).send();
  }

  // Attach user to locals
  res.locals.user = user;

  return next();
};

export const attachServiceData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ServiceAuthenticatedResponse | void> => {
  const serviceId = getBinaryBody(req, "serviceId");
  if (isNil(serviceId)) {
    logger.info(`'${req.path}' was hit without a service id`);
    return res.status(STATUSES.BAD_REQUEST).send();
  }

  // Get the service
  const service = await serviceController.find(serviceId);
  if (isNil(service)) {
    if (service === undefined) {
      logger.error(
        `Error finding the service with id ${serviceId} for endpoint '${req.path}'`
      );
      return res.status(STATUSES.ERROR).send();
    }
    logger.warning(
      `No service with id ${serviceId} for endpoint '${req.path}'`
    );
    return res.status(STATUSES.UNPROCESSABLE).send();
  } else if (!isNil(service.Deactivated)) {
    logger.info(
      `Service with id ${serviceId} has been deactivated at ${service.Deactivated} (endpoint '${req.path}')`
    );
    return res.status(STATUSES.UNPROCESSABLE).send();
  }

  // Attach user to locals
  res.locals.service = service;

  return next();
};
