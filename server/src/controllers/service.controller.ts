import { compareAsc } from "date-fns";
import { isNil } from "lodash";
import { WhereAggregation } from "musqrat/dist/statement";

import { MAX_DATE, MIN_DATE } from "../constants/common.constants";
import { ILogger } from "../lib/logger";
import Service, { IService } from "../schemas/service.schema";

type IServiceQuery = {
    createdStart: Date;
    createdEnd: Date;
    deactivatedStart: Date;
    deactivatedEnd: Date;
    active: boolean;
};

class ServiceController {
    private _logger: ILogger;

    constructor(logger: ILogger) {
        this._logger = logger;
    }

    public async createService(
        service: Omit<IService, "Service_Id">
    ): Promise<Array<IService> | undefined> {
        try {
            return await Service.insert(service).exec();
        } catch (err) {
            this._logger.exception(err, "createService");
            return undefined;
        }
    }

    public async getService(
        serviceId: IService["Service_Id"]
    ): Promise<IService | null | undefined> {
        try {
            const result = await Service.select()
                .where("Service_Id", "=", serviceId)
                .exec();
            return result.length > 0 ? result[0] : null;
        } catch (err) {
            this._logger.exception(err, "getService");
            return undefined;
        }
    }

    public async getServices(): Promise<Array<IService> | undefined> {
        try {
            const result = await Service.select().exec();
            return result;
        } catch (err) {
            this._logger.exception(err, "getService");
            return undefined;
        }
    }

    /*private defaultQuery(query: Partial<IServiceQuery>): IServiceQuery {
        return {
            createdStart: isNil(query.createdStart) ? null : query.createdStart,
            createdEnd: isNil(query.createdEnd) ? null : query.createdEnd,
            deactivatedStart: isNil(query.deactivatedStart)
                ? null
                : query.deactivatedStart,
            deactivatedEnd: isNil(query.deactivatedStart)
                ? null
                : query.deactivatedStart,
            active: isNil(query.active) ? null : query.active,
        };
    }*/

    private createAggregation(
        query: IServiceQuery
    ): WhereAggregation<IService> {
        const agg: WhereAggregation<IService> = {};
        agg.AND = [
            {
                AND: [
                    {
                        field: "Created",
                        operator: ">=",
                        value: query.createdStart,
                    },
                    {
                        field: "Created",
                        operator: "<=",
                        value: query.createdEnd,
                    },
                ],
            },
            {
                AND: [
                    {
                        field: "Deactivated",
                        operator: ">=",
                        value: query.deactivatedStart,
                    },
                    {
                        field: "Created",
                        operator: "<=",
                        value: query.deactivatedEnd,
                    },
                ],
            },
            {
                field: "Deactivated",
                operator: query.active ? "IS" : "IS NOT",
                value: null,
            },
        ];
        return agg;
    }
}

export default ServiceController;
