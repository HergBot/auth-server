import express from "express";

import passwordRouter, { PASSWORD_ROUTER_ROOT } from "./password.routes";
import serviceTokenRouter, {
  SERVICE_TOKEN_ROUTER_ROOT,
} from "./service-token.routes";
import serviceRouter, { SERVICE_ROUTER_ROOT } from "./service.routes";
import sessionRouter, { SESSION_ROUTER_ROOT } from "./session.routes";
import userRouter, { USER_ROUTER_ROOT } from "./user.routes";

export const V1_ROUTER_ROOT = "/v1";

const v1Router = express.Router();

v1Router.use(PASSWORD_ROUTER_ROOT, passwordRouter);
v1Router.use(SERVICE_TOKEN_ROUTER_ROOT, serviceTokenRouter);
v1Router.use(SERVICE_ROUTER_ROOT, serviceRouter);
v1Router.use(SESSION_ROUTER_ROOT, sessionRouter);
v1Router.use(USER_ROUTER_ROOT, userRouter);

export default v1Router;
