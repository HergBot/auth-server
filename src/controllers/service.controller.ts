import { compareAsc } from "date-fns";
import { isNil } from "lodash";
import { WhereAggregation, getUpdates } from "musqrat";

import { MAX_DATE, MIN_DATE } from "../constants/common.constants";
import { ILogger } from "../lib/logger";
import Service, { IService } from "../schemas/service.schema";
import DeactivateController from "./common/deactivate.controller";

type IServiceQuery = {
    createdStart: Date;
    createdEnd: Date;
    deactivatedStart: Date;
    deactivatedEnd: Date;
    active: boolean;
};

class ServiceController extends DeactivateController<
    IService,
    "Service_Id",
    "Deactivated"
> {
    constructor(logger: ILogger) {
        super(logger, Service, "Service_Id", "Deactivated");
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

    /*private createAggregation(
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
    }*/
}

export default ServiceController;
