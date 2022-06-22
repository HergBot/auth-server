import logger from "../lib/console-logger";
import { ILogger } from "../lib/logger";
import ServiceToken, { IServiceToken } from "../schemas/service-token.schema";
import DeactivateController from "./common/deactivate.controller";

class ServiceTokenController extends DeactivateController<
  IServiceToken,
  "Service_Token_Id",
  "Deactivated"
> {
  constructor(logger: ILogger) {
    super(logger, ServiceToken, "Service_Token_Id", "Deactivated");
  }
}

export default new ServiceTokenController(logger);
