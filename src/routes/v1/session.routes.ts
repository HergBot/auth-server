import { addHours } from "date-fns";
import { el } from "date-fns/locale";
import express, { Request, Response } from "express";
import { isNil } from "lodash";
import { v4 as uuidV4 } from "uuid";

import authController from "../../controllers/authentication.controller";
import sessionController, {
  SESSION_LENGTH,
} from "../../controllers/session.controller";
import logger from "../../lib/console-logger";
import {
  UserAuthenticatedLocals,
  UserAuthenticatedResponse,
  authenticateServiceToken,
  authenticateToken,
  authenticateServiceForService,
} from "../../middleware/authentication.middleware";
import {
  authorizeForSession,
  authorizeForSessionUpdate,
  validateSessionUpdate,
} from "../../middleware/session.middleware";
import { INewSession, ISession } from "../../schemas/session.schema";

const SESSION_ROUTER_ROOT = "/session";
const sessionRouter = express.Router();

export interface SessionActionLocals extends UserAuthenticatedLocals {
  session?: ISession;
}

export interface SessionActionResponse extends UserAuthenticatedResponse {
  locals: SessionActionLocals;
}

export interface SessionUpdateLocals extends SessionActionLocals {
  refreshToken?: string;
  expires?: Date;
}

export interface SessionUpdateResponse extends SessionActionResponse {
  locals: SessionUpdateLocals;
}

sessionRouter.post(
  "/",
  authenticateServiceToken,
  authenticateServiceForService,
  async (req: Request, res: Response) => {
    const serviceId = req.body.serviceId;
    const username = req.body.username;
    const password = req.body.password;

    if (isNil(serviceId)) {
      logger.warning(`'${req.path}' was hit without a service id`);
      return res.status(400).send();
    } else if (isNil(username)) {
      logger.warning(`'${req.path}' was hit without a username`);
      return res.status(400).send();
    } else if (isNil(password)) {
      logger.warning(`'${req.path}' was hit without a password`);
      return res.status(403).send();
    }

    const verifiedUser = await authController.login(
      serviceId,
      username,
      password
    );
    if (isNil(verifiedUser)) {
      if (verifiedUser === undefined) {
        logger.error(
          `Error verifying user credentials for username '${username}' (service id '${serviceId}')`
        );
        return res.status(500).send();
      }
      logger.info(
        `Username '${username}' failed to login to service '${serviceId}'`
      );
      return res.status(403).send();
    }

    const now = new Date();
    const newSession: INewSession = {
      User_Id: verifiedUser.User_Id,
      Created: now,
      Expires: addHours(now, SESSION_LENGTH),
      Refresh_Token: uuidV4(),
    };
    const session = await sessionController.create(newSession);
    if (isNil(session)) {
      if (session === undefined) {
        logger.error(
          `Error creating a session for username '${username}' (service id '${serviceId}')`
        );
      } else {
        logger.warning(
          `Did not make session for username '${username}' (service id '${serviceId}')`
        );
      }
      return res.status(500).send();
    }

    logger.info(
      `New session created for username '${username}' (service id '${serviceId}')`
    );
    return res.status(200).json(session);
  }
);

sessionRouter.patch(
  "/:sessionId",
  authenticateToken,
  authorizeForSession,
  validateSessionUpdate,
  authorizeForSessionUpdate,
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
  }
);

sessionRouter.delete(
  "/:sessionId",
  authenticateToken,
  authorizeForSession,
  (req: Request, res: SessionUpdateResponse) => {
    if (isNil(res.locals.sessionId)) {
      return res.status(500).send();
    }

    const now = new Date();
    const session = sessionController.update(res.locals.sessionId, {
      Deactivated: now,
    });
    if (isNil(session)) {
      return res.status(500).send();
    }

    return res.status(200).send(session);
  }
);

export default sessionRouter;

export { SESSION_ROUTER_ROOT };

// POST /session
// - serviceToken
// - username
// - password
// PATCH /session/:sessionId
// - token
// - refreshToken
// - expires
// DELETE /session/:sessionId
// - token

// Middleware
// - authorizeServiceToken
// - authorizeToken
// - validateSessionUpdate
// - authorizeForSession
// - authorizeForSessionUpdate
