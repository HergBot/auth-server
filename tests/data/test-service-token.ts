import { subHours } from "date-fns";

import { IServiceToken } from "../../src/schemas/service-token.schema";
import { TEST_SERVICE } from "./test-service";

const now = new Date();

export const TEST_SERVICE_TOKEN: IServiceToken = {
  Service_Token_Id: "Service_Token",
  Service_Id: TEST_SERVICE.Service_Id,
  Description: "Testing service token",
  Created: now,
};

export const DEACTIVATED_SERVICE_TOKEN: IServiceToken = {
  Service_Token_Id: "Deactivated_Service_Token",
  Service_Id: TEST_SERVICE.Service_Id,
  Description: "Testing deactivated service token",
  Created: subHours(now, 4),
  Deactivated: subHours(now, 2),
};

export const EXPIRED_SERVICE_TOKEN: IServiceToken = {
  Service_Token_Id: "Expired_Service_Token",
  Service_Id: TEST_SERVICE.Service_Id,
  Description: "Testing expired service token",
  Created: subHours(now, 4),
  Expires: subHours(now, 2),
};
