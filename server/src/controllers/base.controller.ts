import { ILogger } from "../lib/logger";

class BaseController {
    protected _logger: ILogger;

    constructor(logger: ILogger) {
        this._logger = logger;
    }
}

export default BaseController;
