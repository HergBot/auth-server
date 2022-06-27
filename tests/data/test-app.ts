import express, { Request, Response, NextFunction } from "express";

const testApp = express();
testApp.use(express.json());
testApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).send("Internal Server Error");
});

export const mockMiddleware = () => {
  // TODO: Try to make this work in this function in a beforeAll or something...
  jest.mock("../../src/middleware/authentication.middleware", () => ({
    authenticateToken: jest.fn((req, res, next) => {
      next();
    }),
    authenticateHergBotAdminToken: jest.fn((req, res, next) => {
      next();
    }),
    authenticateServiceToken: jest.fn((req, res, next) => {
      next();
    }),
    authenticateServiceForService: jest.fn((req, res, next) => {
      next();
    }),
  }));
};

export const restoreMiddleware = () => {
  jest.requireMock("../../src/middleware/authentication.middleware");
};

export default testApp;
