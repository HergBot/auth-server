import { subHours } from "date-fns";

import { IService } from "../../src/schemas/service.schema";

const now = new Date();

export const TEST_SERVICE: IService = {
  Service_Id: 1,
  Name: "Test Service",
  Created: now,
};

export const DEACTIVATED_SERVICE: IService = {
  Service_Id: 2,
  Name: "Deactivated Test Service",
  Created: subHours(now, 4),
  Deactivated: subHours(now, 2),
};
