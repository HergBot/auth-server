import logger from "../lib/console-logger";
import { ILogger } from "../lib/logger";
import User, { IUser } from "../schemas/user.schema";
import DeactivateController from "./common/deactivate.controller";

class UserController extends DeactivateController<
    IUser,
    "User_Id",
    "Deactivated"
> {
    constructor(logger: ILogger) {
        super(logger, User, "User_Id", "Deactivated");
    }
}

export default new UserController(logger);
