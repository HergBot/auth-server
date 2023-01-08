import { IUser } from "../../src/schemas/user.schema";
import { TEST_HERGBOT_AUTH_SERVICE, TEST_SERVICE } from "./test-service";

const now = new Date();

export const TEST_USER: IUser = {
  User_Id: "test-user-id",
  Service_Id: TEST_SERVICE.Service_Id,
  Username: "TestUser",
  Email: "user@test.com",
  Created: now,
};

export const DEACTIVATED_USER: IUser = {
  User_Id: "deactivated-user-id",
  Service_Id: TEST_SERVICE.Service_Id,
  Username: "TestUser",
  Email: "user@test.com",
  Created: now,
  Deactivated: now,
};

export const HERGBOT_AUTH_ADMIN_USER: IUser = {
  User_Id: "hergbot-auth-admin-user-id",
  Service_Id: TEST_HERGBOT_AUTH_SERVICE.Service_Id,
  Username: "TestHergBotAuthAdminUser",
  Email: "hbauth_admin@test.com",
  Created: now,
};

export const HERGBOT_AUTH_NON_ADMIN_USER: IUser = {
  User_Id: "hergbot-auth-non-admin-user-id",
  Service_Id: TEST_HERGBOT_AUTH_SERVICE.Service_Id,
  Username: "TestHergBotAuthNonAdminUser",
  Email: "hbauth_nonadmin@test.com",
  Created: now,
};
