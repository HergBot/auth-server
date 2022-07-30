import request from "supertest";

import { STATUSES } from "../../src/constants/request.constants";
import passwordController from "../../src/controllers/password.controller";
import passwordRouter, {
  PASSWORD_ROUTER_ROOT,
} from "../../src/routes/v1/password.routes";
import testApp from "../data/test-app";
import { TEST_PASSWORD } from "../data/test-password";
import { TEST_USER } from "../data/test-user";

testApp.use(PASSWORD_ROUTER_ROOT, passwordRouter);

let attachUserData = true;
let errorGeneratingSalt = false;
let errorHashingPassword = false;

jest.mock("../../src/middleware/authentication.middleware", () => ({
  authenticateServiceToken: jest.fn((req, res, next) => {
    next();
  }),
  authenticateServiceForUser: jest.fn((req, res, next) => {
    next();
  }),
}));

jest.mock("../../src/middleware/data.middleware", () => ({
  attachUserData: jest.fn((req, res, next) => {
    if (attachUserData) {
      res.locals.user = TEST_USER;
    }
    next();
  }),
}));

jest.mock("../../src/utils/authentication.utils", () => ({
  generateSalt: jest.fn(() => {
    if (errorGeneratingSalt) {
      return undefined;
    }
    return TEST_PASSWORD.Salt;
  }),
  hashPassword: jest.fn((password, salt, version) => {
    if (errorHashingPassword) {
      return undefined;
    }
    return TEST_PASSWORD.Password_Hash;
  }),
}));

describe("[FILE]: password.routes", () => {
  const VALID_BODY = {
    userId: TEST_USER.User_Id,
    password: "password",
  };

  beforeEach(() => {
    attachUserData = true;
    errorGeneratingSalt = false;
    errorHashingPassword = false;
  });

  describe("[ENDPOINT]: POST /v1/password", () => {
    describe("with an invalid body structure", () => {
      describe("with a missing password parameter", () => {
        test(`should return ${STATUSES.BAD_REQUEST}`, async () => {
          const { status } = await request(testApp)
            .post(PASSWORD_ROUTER_ROOT)
            .send({});
          expect(status).toEqual(STATUSES.BAD_REQUEST);
        });
      });
    });

    describe("with missing user data", () => {
      beforeEach(() => {
        attachUserData = false;
      });

      test(`should return ${STATUSES.ERROR}`, async () => {
        const { status } = await request(testApp)
          .post(PASSWORD_ROUTER_ROOT)
          .send(VALID_BODY);
        expect(status).toEqual(STATUSES.ERROR);
      });
    });

    describe("with errors creating the password data", () => {
      describe("with an error creating the salt", () => {
        beforeEach(() => {
          errorGeneratingSalt = true;
        });

        test(`should return ${STATUSES.ERROR}`, async () => {
          const { status } = await request(testApp)
            .post(PASSWORD_ROUTER_ROOT)
            .send(VALID_BODY);
          expect(status).toEqual(STATUSES.ERROR);
        });
      });

      describe("with an error creating the hash", () => {
        beforeEach(() => {
          errorHashingPassword = true;
        });

        test(`should return ${STATUSES.ERROR}`, async () => {
          const { status } = await request(testApp)
            .post(PASSWORD_ROUTER_ROOT)
            .send(VALID_BODY);
          expect(status).toEqual(STATUSES.ERROR);
        });
      });
    });

    describe("when there is an error creating the password", () => {
      beforeEach(() => {
        jest.spyOn(passwordController, "create").mockResolvedValue(undefined);
      });

      test(`should return ${STATUSES.ERROR}`, async () => {
        const { status } = await request(testApp)
          .post(PASSWORD_ROUTER_ROOT)
          .send(VALID_BODY);
        expect(status).toEqual(STATUSES.ERROR);
      });
    });

    describe("when the password fails to be created", () => {
      beforeEach(() => {
        jest.spyOn(passwordController, "create").mockResolvedValue(null);
      });

      test(`should return ${STATUSES.ERROR}`, async () => {
        const { status } = await request(testApp)
          .post(PASSWORD_ROUTER_ROOT)
          .send(VALID_BODY);
        expect(status).toEqual(STATUSES.ERROR);
      });
    });

    describe("when the password is created", () => {
      beforeEach(() => {
        jest
          .spyOn(passwordController, "create")
          .mockResolvedValue(TEST_PASSWORD);
      });

      test(`should return ${STATUSES.CREATED}`, async () => {
        const { status } = await request(testApp)
          .post(PASSWORD_ROUTER_ROOT)
          .send(VALID_BODY);
        expect(status).toEqual(STATUSES.CREATED);
      });
    });
  });
});
