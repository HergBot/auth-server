import express, { NextFunction, Request } from "express";
import { isNil } from "lodash";

import { STATUSES } from "../../constants/request.constants";
import passwordController from "../../controllers/password.controller";
import logger from "../../lib/console-logger";
import {
  authenticateServiceForUser,
  authenticateServiceToken,
  ServiceAuthenticatedResponse,
  UserAuthenticatedResponse,
} from "../../middleware/authentication.middleware";
import { attachUserData } from "../../middleware/data.middleware";
import { INewPassword } from "../../schemas/password.schema";
import {
  CURRENT_PASSWORD_VERSION,
  generateSalt,
  hashPassword,
} from "../../utils/authentication.utils";

const PASSWORD_ROUTER_ROOT = "/password";
const passwordRouter = express.Router();

passwordRouter.post(
  "/",
  authenticateServiceToken,
  attachUserData,
  authenticateServiceForUser,
  async (
    req: Request,
    res: ServiceAuthenticatedResponse & UserAuthenticatedResponse,
    next: NextFunction
  ) => {
    const password = req.body.password;

    if (isNil(password)) {
      logger.warning(`${req.path} was hit without a password`);
      return res.status(STATUSES.BAD_REQUEST).send();
    }

    if (isNil(res.locals.user)) {
      logger.error(`${req.path} was hit without a user attached`);
      return res.status(STATUSES.ERROR).send();
    }

    const salt = await generateSalt(CURRENT_PASSWORD_VERSION);
    if (isNil(salt)) {
      logger.error(
        `Failed to create password for user id '${res.locals.user.User_Id}' because of a undefined salt`
      );
      return res.status(STATUSES.ERROR).send();
    }
    const hash = await hashPassword(password, salt, CURRENT_PASSWORD_VERSION);
    if (isNil(hash)) {
      logger.error(
        `Failed to create password for user id '${res.locals.user.User_Id}' because of a undefined hash`
      );
      return res.status(STATUSES.ERROR).send();
    }

    const newPassword: INewPassword = {
      User_Id: res.locals.user.User_Id,
      Password_Hash: hash,
      Salt: salt,
      Version: CURRENT_PASSWORD_VERSION,
      Created: new Date(),
    };
    const passwordRecord = await passwordController.create(newPassword);
    if (isNil(passwordRecord)) {
      if (passwordRecord === undefined) {
        logger.error(
          `Error creating password for user id '${res.locals.user.User_Id}'`
        );
      } else {
        logger.warning(
          `Failed to create password for user id '${res.locals.user.User_Id}'`
        );
      }
      return res.status(STATUSES.ERROR).send();
    }

    logger.info(
      `Created new password for user id '${res.locals.user.User_Id}')`
    );
    return res.status(STATUSES.CREATED).json();
  }
);

export default passwordRouter;

export { PASSWORD_ROUTER_ROOT };
