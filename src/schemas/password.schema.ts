import musqrat from "musqrat";

import { IUser } from "./user.schema";

export type PasswordVersion = "v1";

interface IPassword {
  Password_Id: Buffer;
  User_Id: IUser["User_Id"];
  Password_Hash: string;
  Salt: string;
  Version: PasswordVersion;
  Created: Date;
  Deactivated?: Date;
}

export type INewPassword = Omit<IPassword, "Password_Id">;

const Password = musqrat.initTable<IPassword, "Password_Id">("Password");

export default Password;
export { IPassword };
