import musqrat from "musqrat";

export type PasswordVersion = "v1";

interface IPassword {
  Password_Id: number;
  User_Id: number;
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
