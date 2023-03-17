import logger from "../lib/console-logger";
import { ILogger } from "../lib/logger";
import User, { INewUser, IUser } from "../schemas/user.schema";
import DeactivateController from "./common/deactivate.controller";

export enum UserValidationError {
  USERNAME_ALREADY_EXISTS = 100,
}

class UserController extends DeactivateController<
  IUser,
  "User_Id",
  "Deactivated"
> {
  constructor(logger: ILogger) {
    super(logger, User, "User_Id", "Deactivated");
  }

  public async validate(user: INewUser): Promise<UserValidationError | null> {
    // Check if the username already exists on the service
    const results = await User.select()
      .where({
        AND: [
          { field: "Username", operator: "=", value: user.Username },
          { field: "Service_Id", operator: "=", value: user.Service_Id },
        ],
      })
      .exec();
    return results.length === 0
      ? null
      : UserValidationError.USERNAME_ALREADY_EXISTS;
  }
}

export default new UserController(logger);
