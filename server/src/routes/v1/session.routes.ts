import { addHours } from "date-fns";
import express from "express";
import { isNil } from "lodash";
import { v4 as uuidV4 } from "uuid";

import AuthenticationController from "../../controllers/authentication.controller";
import SessionController, {
    SESSION_LENGTH,
} from "../../controllers/session.controller";
import { ConsoleLogger } from "../../lib/logger";
import { INewSession, ISession } from "../../schemas/session.schema";

const SESSION_ROUTER_ROOT = "/session";

const authController = new AuthenticationController(new ConsoleLogger());
const sessionController = new SessionController(new ConsoleLogger());
const sessionRouter = express.Router();

sessionRouter.post("/", async (req, res) => {
    const serviceId = req.body.serviceId;
    const username = req.body.username;
    const password = req.body.password;

    if (isNil(username) || isNil(serviceId)) {
        return res.status(404).send();
    } else if (isNil(password)) {
        return res.status(403).send();
    }

    const verifiedUser = await authController.login(
        serviceId,
        username,
        password
    );
    if (isNil(verifiedUser)) {
        return res.status(403).send();
    }

    const now = new Date();
    const newSession: INewSession = {
        User_Id: verifiedUser.User_Id,
        Created: now,
        Expires: addHours(now, SESSION_LENGTH),
        Refresh_Token: uuidV4(),
    };
    const session = sessionController.create(newSession);
    if (isNil(session)) {
        const status = session === undefined ? 500 : 400;
        return res.status(status).send();
    }

    return res.status(200).json(session);
});

sessionRouter.patch("/:sessionId", (req, res) => {
    res.send(`PATCH ${req.params.sessionId}`);
});

export default sessionRouter;

export { SESSION_ROUTER_ROOT };
