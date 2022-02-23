import { isNil } from "lodash";
import { OptionalMulti, SetClause } from "musqrat";

import { ILogger } from "../lib/logger";
import Session, { ISession } from "../schemas/session.schema";
import { getUpdates } from "../utils/database.utils";
import BaseController from "./base.controller";

class SessionController extends BaseController {
    constructor(logger: ILogger) {
        super(logger);
    }

    public async create(
        session: Omit<ISession, "Session_Id">
    ): Promise<ISession | undefined> {
        try {
            const created = await Session.insert(session).exec();
            return created.length > 0 ? created[0] : undefined;
        } catch (err) {
            this._logger.error("Failed to create Session", "create");
            this._logger.debug(`Session: ${JSON.stringify(session)}`, "create");
            this._logger.exception(err, "create");
            return undefined;
        }
    }

    public async update(
        sessionId: ISession["Session_Id"],
        modified: Partial<ISession>
    ): Promise<ISession | null | undefined> {
        const updates = getUpdates(modified);
        if (isNil(updates)) {
            return null;
        }
        try {
            const updated = await Session.update(
                updates
            )
                .where("Session_Id", "=", sessionId)
                .exec();
            return updated.length > 0 ? updated[0] : undefined;
        } catch (err) {
            this._logger.error("Failed to update Session");
            this._logger.debug(
                `Session_Id: ${sessionId}, modified: ${JSON.stringify(
                    modified
                )}, updates: ${JSON.stringify(updates)}`
            );
            this._logger.exception(err, "update");
            return undefined;
        }
    }
}

export default SessionController;
