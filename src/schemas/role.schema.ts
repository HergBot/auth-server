import musqrat from "musqrat";

import { IService } from "./service.schema";

interface IRole {
  Role_Id: string; // Binary
  Service_Id: IService["Service_Id"];
  Name: string;
  Created: Date;
  Deactivated?: Date;
}

const User = musqrat.initTable<IRole>("Role");

export default User;
export { IRole };
