import { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";

import { STATUSES } from "../constants/request.constants";
import userController from "../controllers/user.controller";
import logger from "../lib/console-logger";
import { UserAuthenticatedResponse } from "../middleware/authentication.middleware";

export const attachUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<UserAuthenticatedResponse | void> => {
  const userId = req.body.userId;
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
