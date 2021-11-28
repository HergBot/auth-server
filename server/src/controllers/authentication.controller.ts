import { ILogger } from "../lib/logger";
import Password from "../schemas/password.schema";
import User, { IUser } from "../schemas/user.schema";
import { verifyPassword } from "../utils/authentication.utils";

class AuthenticationController {
    private _logger: ILogger;

    constructor(logger: ILogger) {
        this._logger = logger;
    }

    public async login(
        serviceId: number,
        username: string,
        password: string
    ): Promise<boolean> {
        try {
            // Get the users most recent password
            const result = await Password.select<[IUser]>(
                "Password_Hash",
                "Salt",
                "Version"
            )
                .innerJoin(User, "User_Id", "User_Id")
                .where({
                    AND: [
                        {
                            field: "Username",
                            operator: "=",
                            value: username,
                        },
                        {
                            field: "Service_Id",
                            operator: "=",
                            value: serviceId,
                        },
                        {
                            field: "Deactivated",
                            operator: "IS NOT",
                            value: null,
                        },
                    ],
                })
                .orderBy("Created", "DESC")
                .limit(1)
                .exec();

            if (result.length < 1) {
                this._logger.error(
                    `Username '${username}' tried to login to Service '${serviceId}' when there are no passwords found'`
                );
                return false;
            }
            const passwordData = result[0];
            return verifyPassword(
                passwordData.Password_Hash,
                passwordData.Salt,
                passwordData.Version,
                password
            );
        } catch (err) {
            this._logger.exception(err);
            this._logger.error(
                `Failed to login username: '${username}', service id: '${serviceId}'`
            );
            return false;
        }
    }
}

export default AuthenticationController;
