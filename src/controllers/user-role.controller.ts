import logger from "../lib/console-logger";
import { ILogger } from "../lib/logger";
import UserRole, { IUserRole } from "../schemas/user-role.schema";
import DualKeyController from "./common/dual-key.controller";

class UserRoleController extends DualKeyController<
  IUserRole,
  "User_Id",
  "Role_Id"
> {
  constructor(logger: ILogger) {
    super(logger, UserRole, "User_Id", "Role_Id");
  }
}

export default new UserRoleController(logger);
