import { IUser } from "../../src/schemas/user.schema";
import { TEST_HERGBOT_AUTH_SERVICE, TEST_SERVICE } from "./test-service";

const now = new Date();

export const TEST_USER: IUser = {
  User_Id: Buffer.from("test-user-id", "ascii"),
  Service_Id: TEST_SERVICE.Service_Id,
  Username: "TestUser",
  Email: "user@test.com",
  Created: now,
};

export const DEACTIVATED_USER: IUser = {
  User_Id: Buffer.from("deactivated-user-id", "ascii"),
  Service_Id: TEST_SERVICE.Service_Id,
  Username: "TestUser",
  Email: "user@test.com",
  Created: now,
  Deactivated: now,
};

export const HERGBOT_AUTH_ADMIN_USER: IUser = {
  User_Id: Buffer.from("hergbot-auth-admin-user-id", "ascii"),
  Service_Id: TEST_HERGBOT_AUTH_SERVICE.Service_Id,
  Username: "TestHergBotAuthAdminUser",
  Email: "hbauth_admin@test.com",
  Created: now,
};

export const HERGBOT_AUTH_NON_ADMIN_USER: IUser = {
  User_Id: Buffer.from("hergbot-auth-non-admin-user-id", "ascii"),
  Service_Id: TEST_HERGBOT_AUTH_SERVICE.Service_Id,
  Username: "TestHergBotAuthNonAdminUser",
  Email: "hbauth_nonadmin@test.com",
  Created: now,
};
