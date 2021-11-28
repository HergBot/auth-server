type LogFunction = (message: string, method?: string) => void;

type LogExceptionFunction = (exception: Error | any, method?: string) => void;

export interface ILogger {
    debug: LogFunction;
    error: LogFunction;
    exception: LogExceptionFunction;
    info: LogFunction;
    warning: LogFunction;
}
