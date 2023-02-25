import musqrat from "musqrat";

import { IService } from "./service.schema";

interface IServiceToken {
  Service_Token_Id: Buffer;
  Service_Id: IService["Service_Id"];
  Description: string;
  Created: Date;
  Expires?: Date;
  Deactivated?: Date;
}

export type INewServiceToken = Omit<IServiceToken, "Service_Token_Id">;

const ServiceToken = musqrat.initTable<IServiceToken, "Service_Token_Id">(
  "ServiceToken"
);

export default ServiceToken;
export { IServiceToken };
