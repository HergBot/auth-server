import express from "express";

import sessionRouter, { SESSION_ROUTER_ROOT } from "./session.routes";

export const V1_ROUTER_ROOT = "/v1";

const v1Router = express.Router();

v1Router.use(SESSION_ROUTER_ROOT, sessionRouter);

export default v1Router;
