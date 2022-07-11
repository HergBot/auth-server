import musqrat from "musqrat";

interface IUser {
  User_Id: number;
  Service_Id: number;
  Username: string;
  Email: string;
  Created: Date;
  Deactivated?: Date;
}

export type INewUser = Omit<IUser, "User_Id">;

const User = musqrat.initTable<IUser, "User_Id">("User");

export default User;
export { IUser };
