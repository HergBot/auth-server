import musqrat from "musqrat";

import { IService } from "./service.schema";

interface IUser {
  User_Id: string; // Binary
  Service_Id: IService["Service_Id"];
  Username: string;
  Email: string;
  Created: Date;
  Deactivated?: Date;
}

export type INewUser = Omit<IUser, "User_Id">;

const User = musqrat.initTable<IUser>("User");

export default User;
export { IUser };
