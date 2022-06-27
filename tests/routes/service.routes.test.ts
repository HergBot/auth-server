import request from "supertest";
import serviceController from "../../src/controllers/service.controller";

import sessionController from "../../src/controllers/session.controller";
import serviceRoutes, {
  SERVICE_ROUTER_ROOT,
} from "../../src/routes/v1/service.routes";
import testApp from "../data/test-app";
import { TEST_SERVICE } from "../data/test-service";
import { TEST_SESSION } from "../data/test-session";
import { TEST_USER } from "../data/test-user";

testApp.use(SERVICE_ROUTER_ROOT, serviceRoutes);

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

describe("[FILE]: service.routes", () => {
  const VALID_BODY = {
    name: TEST_SERVICE.Name,
  };

  describe("[ENDPOINT]: POST /v1/service", () => {
    describe("with an invalid body structure", () => {
      describe("with a missing name parameter", () => {
        test("should return 400", async () => {
          const { status } = await request(testApp)
            .post(SERVICE_ROUTER_ROOT)
            .send({});
          expect(status).toEqual(400);
        });
      });
    });

    describe("with a valid body structure", () => {
      describe("when there is an error creating the service", () => {
        beforeEach(() => {
          jest.spyOn(serviceController, "create").mockResolvedValue(undefined);
        });

        test("should return 500", async () => {
          const { status } = await request(testApp)
            .post(SERVICE_ROUTER_ROOT)
            .send(VALID_BODY);
          expect(status).toEqual(500);
        });
      });

      describe("when the service fails to be created", () => {
        beforeEach(() => {
          jest.spyOn(serviceController, "create").mockResolvedValue(null);
        });

        test("should return 500", async () => {
          const { status } = await request(testApp)
            .post(SERVICE_ROUTER_ROOT)
            .send(VALID_BODY);
          expect(status).toEqual(500);
        });
      });

      describe("when the service is created", () => {
        beforeEach(() => {
          jest
            .spyOn(serviceController, "create")
            .mockResolvedValue(TEST_SERVICE);
        });

        test("should return 201", async () => {
          const { status } = await request(testApp)
            .post(SERVICE_ROUTER_ROOT)
            .send(VALID_BODY);
          expect(status).toEqual(201);
        });
      });
    });
  });
});
