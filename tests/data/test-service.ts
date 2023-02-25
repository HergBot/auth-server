import { subHours } from "date-fns";

import { HERGBOT_AUTH_SERVICE_ID } from "../../src/constants/environment.constants";

import { IService } from "../../src/schemas/service.schema";

const now = new Date();

export const TEST_SERVICE: IService = {
  Service_Id: Buffer.from("test-service-id", "ascii"),
  Name: "Test Service",
  Created: now,
};

export const DEACTIVATED_SERVICE: IService = {
  Service_Id: Buffer.from("deactivated-service-id", "ascii"),
  Name: "Deactivated Test Service",
  Created: subHours(now, 4),
  Deactivated: subHours(now, 2),
};

export const TEST_HERGBOT_AUTH_SERVICE: IService = {
  Service_Id: HERGBOT_AUTH_SERVICE_ID,
  Name: "Test HergBot Auth Service",
  Created: now,
};
