import { NextFunction, Request, Response } from "express";
import { isNil } from "lodash";

import sessionController from "../controllers/session.controller";
import { SessionUpdateResponse } from "../routes/v1/session.routes";
import { parseDate } from "../utils/common.utils";
import { validateSessionExpiry } from "../utils/session.utils";

export const validateSessionUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>> | void> => {
    const sessionId = req.params.sessionId;
    const refreshToken = req.body.refreshToken;
    const expires = parseDate(req.body.expires);

    if (isNil(sessionId)) {
        return res.status(404).send();
    } else if (isNil(refreshToken) || isNil(expires)) {
        return res.status(400).send();
    }

    if (validateSessionExpiry(expires)) {
        return res.status(400).send();
    }

    res.locals.sessionId = sessionId;
    res.locals.refreshToken = refreshToken;
    res.locals.expires = expires;
    return next();
};

export const authorizeForSession = async (
    req: Request,
    res: SessionUpdateResponse,
    next: NextFunction
): Promise<Response<any, Record<string, any>> | void> => {
    // Make sure the session exists
    const session = sessionController.find(res.locals.sessionId);
    if (isNil(session)) {
        const status = session === undefined ? 500 : 400;
        return res.status(status).send();
    }
};
