import musqrat from "musqrat";

import { IRole } from "./role.schema";
import { IUser } from "./user.schema";

interface IUserRole {
  User_Id: IUser["User_Id"];
  Role_Id: IRole["Role_Id"];
}

const UserRole = musqrat.initTable<IUserRole>("UserRole");

export default UserRole;
export { IUserRole };
