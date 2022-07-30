import request from "supertest";

import { STATUSES } from "../../src/constants/request.constants";
import userController from "../../src/controllers/user.controller";
import userRouter, { USER_ROUTER_ROOT } from "../../src/routes/v1/user.routes";
import testApp from "../data/test-app";
import { TEST_SERVICE } from "../data/test-service";
import { TEST_USER } from "../data/test-user";

testApp.use(USER_ROUTER_ROOT, userRouter);

let attachServiceData = true;

jest.mock("../../src/middleware/authentication.middleware", () => ({
  authenticateServiceToken: jest.fn((req, res, next) => {
    if (attachServiceData) {
      res.locals.service = TEST_SERVICE;
    }
    next();
  }),
  authenticateServiceForService: jest.fn((req, res, next) => {
    next();
  }),
}));

describe("[FILE]: user.routes", () => {
  const VALID_BODY = {
    username: "username-body",
    email: "email-body",
  };

  beforeEach(() => {
    attachServiceData = true;
  });

  describe("[ENDPOINT]: POST /v1/user", () => {
    describe("with an invalid body structure", () => {
      describe("with a missing username parameter", () => {
        test(`should return ${STATUSES.BAD_REQUEST}`, async () => {
          const { status } = await request(testApp)
            .post(USER_ROUTER_ROOT)
            .send({});
          expect(status).toEqual(STATUSES.BAD_REQUEST);
        });
      });

      describe("with a missing email parameter", () => {
        test(`should return ${STATUSES.BAD_REQUEST}`, async () => {
          const { status } = await request(testApp)
            .post(USER_ROUTER_ROOT)
            .send({ username: "username-body" });
          expect(status).toEqual(STATUSES.BAD_REQUEST);
        });
      });
    });

    describe("with missing user data", () => {
      beforeEach(() => {
        attachServiceData = false;
      });

      test(`should return ${STATUSES.ERROR}`, async () => {
        const { status } = await request(testApp)
          .post(USER_ROUTER_ROOT)
          .send(VALID_BODY);
        expect(status).toEqual(STATUSES.ERROR);
      });
    });

    describe("when there is an error creating the user", () => {
      beforeEach(() => {
        jest.spyOn(userController, "create").mockResolvedValue(undefined);
      });

      test(`should return ${STATUSES.ERROR}`, async () => {
        const { status } = await request(testApp)
          .post(USER_ROUTER_ROOT)
          .send(VALID_BODY);
        expect(status).toEqual(STATUSES.ERROR);
      });
    });

    describe("when the user fails to be created", () => {
      beforeEach(() => {
        jest.spyOn(userController, "create").mockResolvedValue(null);
      });

      test(`should return ${STATUSES.ERROR}`, async () => {
        const { status } = await request(testApp)
          .post(USER_ROUTER_ROOT)
          .send(VALID_BODY);
        expect(status).toEqual(STATUSES.ERROR);
      });
    });

    describe("when the user is created", () => {
      beforeEach(() => {
        jest.spyOn(userController, "create").mockResolvedValue(TEST_USER);
      });

      test(`should return ${STATUSES.CREATED}`, async () => {
        const { status } = await request(testApp)
          .post(USER_ROUTER_ROOT)
          .send(VALID_BODY);
        expect(status).toEqual(STATUSES.CREATED);
      });
    });
  });
});
