import { ILogger } from "../../src/lib/logger";

class TestLogger implements ILogger {
    public debug(message: string, method?: string): void {}

    public error(message: string, method?: string): void {}

    public exception(exception: Error | any, method?: string): void {}

    public info(message: string, method?: string): void {}

    public warning(message: string, method?: string): void {}
}

export default TestLogger;
