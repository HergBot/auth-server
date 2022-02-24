import { compareAsc } from "date-fns";
import { isNil } from "lodash";
import { WhereAggregation, getUpdates } from "musqrat";

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

    public async create(
        service: Omit<IService, "Service_Id">
    ): Promise<Array<IService> | undefined> {
        try {
            return await Service.insert(service).exec();
        } catch (err) {
            this._logger.error("Failed to create Service", "create");
            this._logger.debug(`Service: ${JSON.stringify(service)}`, "create");
            this._logger.exception(err, "create");
            return undefined;
        }
    }

    public async find(
        serviceId: IService["Service_Id"]
    ): Promise<IService | null | undefined> {
        try {
            const result = await Service.select()
                .where("Service_Id", "=", serviceId)
                .exec();
            return result.length > 0 ? result[0] : null;
        } catch (err) {
            this._logger.error("Failed to find Service", "find");
            this._logger.debug(`Service Id: ${serviceId}`, "find");
            this._logger.exception(err, "find");
            return undefined;
        }
    }

    public async query(): Promise<Array<IService> | undefined> {
        try {
            const result = await Service.select().exec();
            return result;
        } catch (err) {
            this._logger.error("Failed to query Services", "query");
            //this._logger.debug(`Query: ${}`, "query");
            this._logger.exception(err, "query");
            return undefined;
        }
    }

    public async update(
        serviceId: IService["Service_Id"],
        modified: Omit<Partial<IService>, "Service_Id">
    ): Promise<IService | null | undefined> {
        const updates = getUpdates(modified);
        if (isNil(updates)) {
            this._logger.warning(
                "Attempted to update a service with no valid updates",
                "update"
            );
            this._logger.debug(
                `Service_Id: ${serviceId}, modified: ${JSON.stringify(
                    modified
                )}`,
                "update"
            );
            return null;
        }
        try {
            const updated = await Service.update(updates)
                .where("Service_Id", "=", serviceId)
                .exec();
            const result = updated.length > 0 ? updated[0] : null;
            if (isNil(result)) {
                this._logger.warning(
                    "Attempted to update a service but no updates were made",
                    "update"
                );
                this._logger.debug(
                    `Service_Id: ${serviceId}, modified: ${JSON.stringify(
                        modified
                    )}`,
                    "update"
                );
            }
            return result;
        } catch (err) {
            this._logger.error("Failed to update Service", "update");
            this._logger.debug(
                `Service_Id: ${serviceId}, modified: ${JSON.stringify(
                    modified
                )}, updates: ${JSON.stringify(updates)}`,
                "update"
            );
            this._logger.exception(err, "update");
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
