import { addHours, subHours } from "date-fns";

import { ISession } from "../../src/schemas/session.schema";
import { TEST_USER } from "./test-user";

const now = new Date();

export const TEST_SESSION: ISession = {
  Session_Id: Buffer.from("1", "ascii"),
  User_Id: TEST_USER.User_Id,
  Refresh_Token: "refresh_token",
  Expires: addHours(now, 4),
  Created: now,
};

export const EXPIRED_SESSION: ISession = {
  Session_Id: Buffer.from("2", "ascii"),
  User_Id: TEST_USER.User_Id,
  Refresh_Token: "refresh_token",
  Expires: subHours(now, 4),
  Created: subHours(now, 8),
};

export const DEACTIVATED_SESSION: ISession = {
  Session_Id: Buffer.from("3", "ascii"),
  User_Id: TEST_USER.User_Id,
  Refresh_Token: "refresh_token",
  Expires: addHours(now, 3),
  Created: subHours(now, 1),
  Deactivated: now,
};
