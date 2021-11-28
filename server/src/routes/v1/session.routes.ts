import express from "express";

const SESSION_ROUTER_ROOT = "/session";

const sessionRouter = express.Router();

sessionRouter.post("/", (req, res) => {
    res.send("POST");
});

sessionRouter.patch("/:sessionId", (req, res) => {
    res.send(`PATCH ${req.params.sessionId}`);
});

export default sessionRouter;

export { SESSION_ROUTER_ROOT };
