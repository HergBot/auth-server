import request from "supertest";

import authenticationController from "../../src/controllers/authentication.controller";
import sessionController from "../../src/controllers/session.controller";
import sessionRouter, {
  SESSION_ROUTER_ROOT,
} from "../../src/routes/v1/session.routes";
import testApp from "../data/test-app";
import { TEST_SESSION } from "../data/test-session";
import { TEST_USER } from "../data/test-user";

testApp.use(SESSION_ROUTER_ROOT, sessionRouter);

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

describe("[FILE]: session.routes", () => {
  describe("[ENDPOINT]: POST /v1/session", () => {
    const VALID_BODY = {
      serviceId: TEST_USER.Service_Id,
      username: TEST_USER.Username,
      password: "password",
    };

    describe("with an invalid body structure", () => {
      describe("when serviceId is missing", () => {
        test("should return 400", async () => {
          const { status } = await request(testApp)
            .post(SESSION_ROUTER_ROOT)
            .send({ username: TEST_USER.Username, password: "password" });
          expect(status).toEqual(400);
        });
      });

      describe("when username is missing", () => {
        test("should return 400", async () => {
          const { status } = await request(testApp)
            .post(SESSION_ROUTER_ROOT)
            .send({ serviceId: TEST_USER.Service_Id, password: "password" });
          expect(status).toEqual(400);
        });
      });

      describe("when password is missing", () => {
        test("should return 403", async () => {
          const { status } = await request(testApp)
            .post(SESSION_ROUTER_ROOT)
            .send({
              serviceId: TEST_USER.Service_Id,
              username: TEST_USER.Username,
            });
          expect(status).toEqual(403);
        });
      });
    });

    describe("with an unverified login", () => {
      describe("when there is an error verifying the user", () => {
        beforeEach(() => {
          jest
            .spyOn(authenticationController, "login")
            .mockResolvedValue(undefined);
        });

        test("should return 500", async () => {
          const { status } = await request(testApp)
            .post(SESSION_ROUTER_ROOT)
            .send(VALID_BODY);
          expect(status).toEqual(500);
        });
      });

      describe("when the user credentials are invalid", () => {
        beforeEach(() => {
          jest.spyOn(authenticationController, "login").mockResolvedValue(null);
        });

        test("should return 403", async () => {
          const { status } = await request(testApp)
            .post(SESSION_ROUTER_ROOT)
            .send(VALID_BODY);
          expect(status).toEqual(403);
        });
      });
    });

    describe("with a verified login", () => {
      beforeEach(() => {
        jest
          .spyOn(authenticationController, "login")
          .mockResolvedValue(TEST_USER);
      });

      describe("when there is an error creating the session", () => {
        beforeEach(() => {
          jest.spyOn(sessionController, "create").mockResolvedValue(undefined);
        });

        test("should return 500", async () => {
          const { status } = await request(testApp)
            .post(SESSION_ROUTER_ROOT)
            .send(VALID_BODY);
          expect(status).toEqual(500);
        });
      });

      describe("when the session structure is invalid", () => {
        beforeEach(() => {
          jest.spyOn(sessionController, "create").mockResolvedValue(null);
        });

        test("should return 500", async () => {
          const { status } = await request(testApp)
            .post(SESSION_ROUTER_ROOT)
            .send(VALID_BODY);
          expect(status).toEqual(500);
        });
      });

      describe("when the session is successfully created", () => {
        beforeEach(() => {
          jest
            .spyOn(sessionController, "create")
            .mockResolvedValue(TEST_SESSION);
        });

        test("should return 200", async () => {
          const { status } = await request(testApp)
            .post(SESSION_ROUTER_ROOT)
            .send(VALID_BODY);
          expect(status).toEqual(200);
        });
      });
    });
  });
});
