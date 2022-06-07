import { HERGBOT_AUTH_SERVICE_ID } from "../../src/constants/environment.constants";
import { IUser } from "../../src/schemas/user.schema";

const now = new Date();

export const TEST_USER: IUser = {
  User_Id: 1,
  Service_Id: 1,
  Username: "TestUser",
  Email: "user@test.com",
  Created: now,
};

export const DEACTIVATED_USER: IUser = {
  User_Id: 1,
  Service_Id: 1,
  Username: "TestUser",
  Email: "user@test.com",
  Created: now,
  Deactivated: now,
};

export const HERGBOT_AUTH_ADMIN_USER: IUser = {
  User_Id: 1,
  Service_Id: HERGBOT_AUTH_SERVICE_ID,
  Username: "TestHergBotAuthAdminUser",
  Email: "hbauth_admin@test.com",
  Created: now,
};

export const HERGBOT_AUTH_NON_ADMIN_USER: IUser = {
  User_Id: 1,
  Service_Id: HERGBOT_AUTH_SERVICE_ID,
  Username: "TestHergBotAuthNonAdminUser",
  Email: "hbauth_nonadmin@test.com",
  Created: now,
};
