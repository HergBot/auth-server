import { format } from "date-fns";
import { isNil } from "lodash";

type LogFunction = (message: string, method?: string) => void;

type LogExceptionFunction = (exception: Error | any, method?: string) => void;

export type LogPrefix = "DBG" | "ERR" | "EXC" | "INF" | "WRN";

export interface ILogger {
    debug: LogFunction;
    error: LogFunction;
    exception: LogExceptionFunction;
    info: LogFunction;
    warning: LogFunction;
}
