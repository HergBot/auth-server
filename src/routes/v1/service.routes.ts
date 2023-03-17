import express, { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";

import { STATUSES } from "../../constants/request.constants";
import serviceController from "../../controllers/service.controller";
import logger from "../../lib/console-logger";
import {
  authenticateHergBotAdminToken,
  authenticateToken,
} from "../../middleware/authentication.middleware";
import { INewService } from "../../schemas/service.schema";

const SERVICE_ROUTER_ROOT = "/service";
const serviceRouter = express.Router();

serviceRouter.post(
  "/",
  authenticateToken,
  authenticateHergBotAdminToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    if (isNil(name)) {
      logger.warning(`${req.path} was hit without a name`);
      return res.status(STATUSES.BAD_REQUEST).send();
    }

    const newService: INewService = {
      Name: name,
      Created: new Date(),
    };
    const service = await serviceController.create(newService);
    if (isNil(service)) {
      if (service === undefined) {
        logger.error(`Error creating service with name '${name}'`);
      } else {
        logger.warning(`Failed to create service with name '${name}'`);
      }
      return res.status(STATUSES.ERROR).send();
    }

    logger.info(
      `Created new service with name '${
        service.Name
      }' (service id '${service.Service_Id.toString("hex")}')`
    );
    return res.status(STATUSES.CREATED).json(service);
  }
);

export default serviceRouter;

export { SERVICE_ROUTER_ROOT };
