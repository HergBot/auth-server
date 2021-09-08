type LogFunction = (message: string, method?: string) => void;

export interface ILogger {
    debug: LogFunction
    error: LogFunction
    exception: LogFunction
    info: LogFunction
    warning: LogFunction
}
