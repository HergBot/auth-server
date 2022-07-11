import logger from "../lib/console-logger";
import { ILogger } from "../lib/logger";
import Password, { IPassword } from "../schemas/password.schema";
import DeactivateController from "./common/deactivate.controller";

class PasswordController extends DeactivateController<
  IPassword,
  "Password_Id",
  "Deactivated"
> {
  constructor(logger: ILogger) {
    super(logger, Password, "Password_Id", "Deactivated");
  }
}

export default new PasswordController(logger);
