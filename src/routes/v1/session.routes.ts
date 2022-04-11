import { addHours } from "date-fns";
import express, { Request, Response } from "express";
import { isNil } from "lodash";
import { v4 as uuidV4 } from "uuid";

import authController from "../../controllers/authentication.controller";
import sessionController, {
  SESSION_LENGTH,
} from "../../controllers/session.controller";
import {
  AuthenticatedLocals,
  AuthenticatedResponse,
  authenticateToken,
} from "../../middleware/authentication.middleware";
import {
  authorizeForSession,
  validateSessionUpdate,
} from "../../middleware/session.moddleware";
import { INewSession } from "../../schemas/session.schema";

const SESSION_ROUTER_ROOT = "/session";
const sessionRouter = express.Router();

export interface SessionUpdateLocals extends AuthenticatedLocals {
  sessionId?: string;
  refreshToken?: string;
  expires?: Date;
}

export interface SessionUpdateResponse extends AuthenticatedResponse {
  locals: SessionUpdateLocals;
}

sessionRouter.post("/", async (req: Request, res: Response) => {
  const serviceId = req.body.serviceId;
  const username = req.body.username;
  const password = req.body.password;

  if (isNil(username) || isNil(serviceId)) {
    return res.status(400).send();
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

sessionRouter.patch(
  "/:sessionId",
  (req: Request, res: SessionUpdateResponse) => {
    if (isNil(res.locals.sessionId)) {
      return res.status(500).send();
    }
    const now = new Date();
    const newExpiry = addHours(now, SESSION_LENGTH);
    const session = sessionController.update(res.locals.sessionId, {
      Expires: newExpiry,
    });
    if (isNil(session)) {
      return res.status(500).send();
    }

    return res.status(200).send(session);
  },
  [authenticateToken, validateSessionUpdate, authorizeForSession]
);

sessionRouter.delete("/:sessionId", (req, res) => {});

export default sessionRouter;

export { SESSION_ROUTER_ROOT };
