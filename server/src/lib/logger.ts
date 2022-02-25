import { format } from "date-fns";
import { isNil } from "lodash";

type LogFunction = (message: string, method?: string) => void;

type LogExceptionFunction = (exception: Error | any, method?: string) => void;

type LogPrefix = "DBG" | "ERR" | "EXC" | "INF" | "WRN";

export interface ILogger {
    debug: LogFunction;
    error: LogFunction;
    exception: LogExceptionFunction;
    info: LogFunction;
    warning: LogFunction;
}

class ConsoleLogger implements ILogger {
    public debug(message: string, method?: string): void {
        this.logMessage("DBG", message, method);
    }

    public error(message: string, method?: string): void {
        this.logMessage("ERR", message, method);
    }

    public exception(exception: Error, method?: string): void {
        this.logMessage("EXC", exception.message, method);
    }

    public info(message: string, method?: string): void {
        this.logMessage("INF", message, method);
    }

    public warning(message: string, method?: string): void {
        this.logMessage("WRN", message, method);
    }

    private get timestamp() {
        return format(new Date(), "yyyy-MM-dd HH:mm:ss");
    }

    private logMethod(method?: string): string {
        return isNil(method) ? "" : ` @ ${method}`;
    }

    private logMessage(
        prefix: LogPrefix,
        message: string,
        method?: string
    ): void {
        console.log(
            `[${prefix}] ${this.timestamp}${this.logMethod(method)}: ${message}`
        );
    }
}

export { ConsoleLogger };
