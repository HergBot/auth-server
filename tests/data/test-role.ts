import { IRole } from "../../src/schemas/role.schema";
import { TEST_HERGBOT_AUTH_SERVICE } from "./test-service";

const now = new Date();

export const HERGBOT_AUTH_SERVICE_ADMIN_ROLE: IRole = {
  Role_Id: Buffer.from("hergbot-auth-service-admin-role-id", "ascii"),
  Service_Id: TEST_HERGBOT_AUTH_SERVICE.Service_Id,
  Name: "Admin",
  Created: now,
};
