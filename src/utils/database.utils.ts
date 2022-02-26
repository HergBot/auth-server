import { isNil, isUndefined } from "lodash";
import {
    AggregationCondition,
    OptionalEmptyMulti,
    OptionalMulti,
    SetClause,
    WhereAggregation,
    WhereChain,
    WhereClause,
} from "musqrat";

type ConditionalOptions = {
    type?: "single" | "range" | "set";
    inclusive?: boolean;
    chain?: WhereChain;
};

type ConditionalParam<Schema, Query> = {
    field: keyof Schema;
    value: Query[keyof Query];
};

// TODO: Decide if this can be done. Was trying to make a function to create conditional queries from query params
/*export const addConditional = <Schema, Query>(options: ConditionalOptions, ...params: Array<ConditionalParam<Schema, Query>>): AggregationCondition<Schema> => {
    if (params.length === 1 && (isNil(options.type) || options.type === 'single')) {
        return {
            field: params[0].field,
            operator: '=',
            value: params[0].value
        } as WhereClause<Schema>
    }
};*/

/*export const getUpdates = <Schema>(
    modified: Schema
): OptionalMulti<SetClause<Schema>> | null => {
    let updates: OptionalMulti<SetClause<Schema>> | null = null;
    let key: keyof Schema;
    for (key in modified) {
        if (!isUndefined(modified[key])) {
            const set: SetClause<Schema> = { field: key, value: modified[key] };
            if (isNil(updates)) {
                updates = [set];
            } else {
                updates.push(set);
            }
        }
    }
    return updates;
};*/
