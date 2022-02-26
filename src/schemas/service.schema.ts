import musqrat from 'musqrat';

interface IService {
    Service_Id: number;
    Name: string;
    Created: Date;
    Deactivated?: Date;
}

const Service = musqrat.initTable<IService, 'Service_Id'>('Service');

export default Service;
export { IService }
