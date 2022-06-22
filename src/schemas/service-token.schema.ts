import musqrat from "musqrat";

interface IServiceToken {
  Service_Token_Id: string;
  Service_Id: number;
  Description: string;
  Created: Date;
  Expires?: Date;
  Deactivated?: Date;
}

const ServiceToken = musqrat.initTable<IServiceToken, "Service_Token_Id">(
  "ServiceToken"
);

export default ServiceToken;
export { IServiceToken };
