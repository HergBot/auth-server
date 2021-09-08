import { isNil } from 'lodash';
import { AggregationCondition, WhereAggregation, WhereChain, WhereClause } from 'musqrat/dist/statement';

type ConditionalOptions = {
    type?: 'single' | 'range' | 'set';
    inclusive?: boolean;
    chain?: WhereChain
};

type ConditionalParam<Schema, Query> = {
    field: keyof Schema;
    value: Query[keyof Query]
}

export const addConditional = <Schema, Query>(options: ConditionalOptions, ...params: Array<ConditionalParam<Schema, Query>>): AggregationCondition<Schema> => {
    if (params.length === 1 && (isNil(options.type) || options.type === 'single')) {
        return {
            field: params[0].field,
            operator: '=',
            value: params[0].value
        } as WhereClause<Schema>
    }
};