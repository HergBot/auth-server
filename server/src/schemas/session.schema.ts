import musqrat from "musqrat";

interface ISession {
    Session_Id: string;
    User_Id: number;
    Refresh_Token: string;
    Expires: Date;
    Created: Date;
    Deactivated?: Date;
}

const Session = musqrat.initTable<ISession, "Session_Id">("Session");

export default Session;
export { ISession };
