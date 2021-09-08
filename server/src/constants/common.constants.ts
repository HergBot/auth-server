import { parse } from 'date-fns';

export const MIN_DATE = parse('2020-01-01 00:00:00', 'yyyy-MM-dd hh:mm:ss', new Date());

export const MAX_DATE = parse('2049-12-31 11:59:59', 'yyyy-MM-dd hh:mm:ss', new Date());
