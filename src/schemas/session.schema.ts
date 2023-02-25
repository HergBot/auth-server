import musqrat from "musqrat";

import { IUser } from "./user.schema";

interface ISession {
  Session_Id: Buffer;
  User_Id: IUser["User_Id"];
  Refresh_Token: string;
  Expires: Date;
  Created: Date;
  Deactivated?: Date;
}

export type INewSession = Omit<ISession, "Session_Id">;

const Session = musqrat.initTable<ISession, "Session_Id">("Session");

export default Session;
export { ISession };
