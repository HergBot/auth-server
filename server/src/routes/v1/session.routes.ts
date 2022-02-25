import express from "express";
import { isNil } from "lodash";

import AuthenticationController from "../../controllers/authentication.controller";
import { ConsoleLogger } from "../../lib/logger";

const SESSION_ROUTER_ROOT = "/session";

const authController = new AuthenticationController(new ConsoleLogger());
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

    const result = await authController.login(serviceId, username, password);

    res.send("POST");
});

sessionRouter.patch("/:sessionId", (req, res) => {
    res.send(`PATCH ${req.params.sessionId}`);
});

export default sessionRouter;

export { SESSION_ROUTER_ROOT };
