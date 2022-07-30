import musqrat from "musqrat";

interface IServiceToken {
  Service_Token_Id: string;
  Service_Id: number;
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
