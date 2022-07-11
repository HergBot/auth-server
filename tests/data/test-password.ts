import { IPassword } from "../../src/schemas/password.schema";
import { CURRENT_PASSWORD_VERSION } from "../../src/utils/authentication.utils";
import { TEST_USER } from "./test-user";

const now = new Date();

export const TEST_PASSWORD: IPassword = {
  Password_Id: 1,
  User_Id: TEST_USER.User_Id,
  Password_Hash: "password-hash",
  Salt: "salty",
  Version: CURRENT_PASSWORD_VERSION,
  Created: now,
};
