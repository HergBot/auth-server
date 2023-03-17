import { addDays } from "date-fns";
import express, { NextFunction, Request } from "express";
import { isNil } from "lodash";

import { STATUSES } from "../../constants/request.constants";
import serviceTokenController from "../../controllers/service-token.controller";
import logger from "../../lib/console-logger";
import {
  authenticateHergBotAdminToken,
  authenticateToken,
  ServiceAuthenticatedResponse,
  UserAuthenticatedResponse,
} from "../../middleware/authentication.middleware";
import { attachServiceData } from "../../middleware/data.middleware";
import { INewServiceToken } from "../../schemas/service-token.schema";

const SERVICE_TOKEN_ROUTER_ROOT = "/service-token";
const serviceTokenRouter = express.Router();

export const DEFAULT_DAYS_VALID = 90;

serviceTokenRouter.post(
  "/",
  authenticateToken,
  authenticateHergBotAdminToken,
  attachServiceData,
  async (
    req: Request,
    res: ServiceAuthenticatedResponse & UserAuthenticatedResponse,
    next: NextFunction
  ) => {
    const { description, daysValid } = req.body;

    if (isNil(res.locals.service)) {
      logger.error(`${req.path} was hit without a service attached`);
      return res.status(STATUSES.ERROR).send();
    }

    if (isNil(description)) {
      logger.warning(`${req.path} was hit without a description`);
      return res.status(STATUSES.BAD_REQUEST).send();
    } else if (!isNil(daysValid) && isNaN(parseInt(daysValid))) {
      logger.warning(
        `${req.path} was hit without a valid days valid '${daysValid}'`
      );
      return res.status(STATUSES.BAD_REQUEST).send();
    }

    const parsedDaysValid = isNil(daysValid)
      ? DEFAULT_DAYS_VALID
      : parseInt(daysValid);

    const newServiceToken: INewServiceToken = {
      Service_Id: res.locals.service.Service_Id,
      Description: description,
      Created: new Date(),
      Expires: addDays(new Date(), parsedDaysValid),
    };
    const serviceTokenRecord = await serviceTokenController.create(
      newServiceToken
    );
    if (isNil(serviceTokenRecord)) {
      if (serviceTokenRecord === undefined) {
        logger.error(
          `Error creating service token for service id '${res.locals.service.Service_Id.toString(
            "hex"
          )}'`
        );
      } else {
        logger.warning(
          `Failed to create service token for service id '${res.locals.service.Service_Id.toString(
            "hex"
          )}'`
        );
      }
      return res.status(STATUSES.ERROR).send();
    }

    logger.info(
      `Created new service token for service id '${res.locals.service.Service_Id.toString(
        "hex"
      )}')`
    );
    return res.status(STATUSES.CREATED).json(serviceTokenRecord);
  }
);

export default serviceTokenRouter;

export { SERVICE_TOKEN_ROUTER_ROOT };
