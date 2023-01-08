import musqrat from "musqrat";

interface IService {
  Service_Id: string; // Binary
  Name: string;
  Created: Date;
  Deactivated?: Date;
}

export type INewService = Omit<IService, "Service_Id">;

const Service = musqrat.initTable<IService>("Service");

export default Service;
export { IService };
