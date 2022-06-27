import musqrat from "musqrat";

interface IService {
  Service_Id: number;
  Name: string;
  Created: Date;
  Deactivated?: Date;
}

export type INewService = Omit<IService, "Service_Id">;

const Service = musqrat.initTable<IService, "Service_Id">("Service");

export default Service;
export { IService };
