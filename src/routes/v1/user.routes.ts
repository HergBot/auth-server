import express, { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";

import { STATUSES } from "../../constants/request.constants";
import userController, {
  UserValidationError,
} from "../../controllers/user.controller";
import logger from "../../lib/console-logger";
import {
  authenticateServiceForService,
  authenticateServiceToken,
  ServiceAuthenticatedResponse,
} from "../../middleware/authentication.middleware";
import { INewUser } from "../../schemas/user.schema";

const USER_ROUTER_ROOT = "/user";
const userRouter = express.Router();

userRouter.get(
  "/",
  async (
    req: Request,
    res: ServiceAuthenticatedResponse,
    next: NextFunction
  ) => {
    const user = await userController.find(Buffer.from(""));
    if (isNil(user)) {
      return res.status(STATUSES.ERROR).send();
    }
    return res.status(STATUSES.OK).json(user);
  }
);

userRouter.post(
  "/",
  authenticateServiceToken,
  authenticateServiceForService,
  async (
    req: Request,
    res: ServiceAuthenticatedResponse,
    next: NextFunction
  ) => {
    const { username, email } = req.body;
    if (isNil(username)) {
      logger.warning(`${req.path} was hit without a username`);
      return res.status(STATUSES.BAD_REQUEST).send();
    } else if (isNil(email)) {
      logger.warning(`${req.path} was hit without an email`);
      return res.status(STATUSES.BAD_REQUEST).send();
    }

    if (isNil(res.locals.service)) {
      logger.error(`${req.path} was hit without a service attached`);
      return res.status(STATUSES.ERROR).send();
    }

    const newUser: INewUser = {
      Service_Id: res.locals.service.Service_Id,
      Username: username,
      Email: email,
      Created: new Date(),
    };
    const validationCode = await userController.validate(newUser);
    if (validationCode !== null) {
      let error = "Unable to create user";
      switch (validationCode) {
        case UserValidationError.USERNAME_ALREADY_EXISTS:
          error = "Username already exists.";
          break;
      }
      return res
        .status(400)
        .json({ error: { code: validationCode, message: error } });
    }
    const user = await userController.create(newUser);
    if (isNil(user)) {
      if (user === undefined) {
        logger.error(`Error creating user with username '${username}'`);
      } else {
        logger.warning(`Failed to create user with username '${username}'`);
      }
      return res.status(STATUSES.ERROR).send();
    }

    logger.info(
      `Created new user with username '${
        user.Username
      }' (user id '${user.User_Id.toString("hex")}')`
    );
    return res.status(STATUSES.CREATED).json({
      ...user,
      User_Id: user.User_Id.toString("hex"),
      Service_Id: user.Service_Id.toString("hex"),
    });
  }
);

userRouter.put(
  "/",
  async (
    req: Request,
    res: ServiceAuthenticatedResponse,
    next: NextFunction
  ) => {
    const user = await userController.update(Buffer.from(""), {
      Username: "hergbot2",
    });
    if (isNil(user)) {
      return res.status(STATUSES.ERROR).send();
    }
    return res.status(STATUSES.OK).json(user);
  }
);

userRouter.delete(
  "/",
  async (
    req: Request,
    res: ServiceAuthenticatedResponse,
    next: NextFunction
  ) => {
    const user = await userController.deactivate(Buffer.from(""), new Date());
    if (isNil(user)) {
      return res.status(STATUSES.ERROR).send();
    }
    return res.status(STATUSES.OK).json(user);
  }
);

export default userRouter;

export { USER_ROUTER_ROOT };
