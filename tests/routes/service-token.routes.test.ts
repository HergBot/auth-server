import { differenceInDays, intervalToDuration, parseISO } from "date-fns";
import request from "supertest";

import { STATUSES } from "../../src/constants/request.constants";
import serviceTokenController from "../../src/controllers/service-token.controller";
import serviceTokenRouter, {
  DEFAULT_DAYS_VALID,
  SERVICE_TOKEN_ROUTER_ROOT,
} from "../../src/routes/v1/service-token.routes";
import testApp from "../data/test-app";
import { TEST_PASSWORD } from "../data/test-password";
import { TEST_SERVICE } from "../data/test-service";
import { TEST_SERVICE_TOKEN } from "../data/test-service-token";
import { TEST_USER } from "../data/test-user";

testApp.use(SERVICE_TOKEN_ROUTER_ROOT, serviceTokenRouter);

let attachServiceData = true;

jest.mock("../../src/middleware/authentication.middleware", () => ({
  authenticateToken: jest.fn((req, res, next) => {
    next();
  }),
  authenticateHergBotAdminToken: jest.fn((req, res, next) => {
    next();
  }),
}));

jest.mock("../../src/middleware/data.middleware", () => ({
  attachServiceData: jest.fn((req, res, next) => {
    if (attachServiceData) {
      res.locals.service = TEST_SERVICE;
    }
    next();
  }),
}));

describe("[FILE]: service-token.routes", () => {
  const VALID_BODY_NO_EXPIRY = {
    serviceId: TEST_SERVICE.Service_Id,
    description: "description",
  };
  const VALID_BODY_WITH_EXPIRY = {
    ...VALID_BODY_NO_EXPIRY,
    daysValid: 180,
  };

  beforeEach(() => {
    attachServiceData = true;
  });

  describe("[ENDPOINT]: POST /v1/service-token", () => {
    describe("with missing service data", () => {
      beforeEach(() => {
        attachServiceData = false;
      });

      test(`should return ${STATUSES.ERROR}`, async () => {
        const { status } = await request(testApp)
          .post(SERVICE_TOKEN_ROUTER_ROOT)
          .send(VALID_BODY_NO_EXPIRY);
        expect(status).toEqual(STATUSES.ERROR);
      });
    });

    describe("with an invalid body structure", () => {
      describe("with a missing description parameter", () => {
        test(`should return ${STATUSES.BAD_REQUEST}`, async () => {
          const { status } = await request(testApp)
            .post(SERVICE_TOKEN_ROUTER_ROOT)
            .send({ serviceId: TEST_SERVICE.Service_Id });
          expect(status).toEqual(STATUSES.BAD_REQUEST);
        });
      });

      describe("with an invalid daysValid parameter", () => {
        test(`should return ${STATUSES.BAD_REQUEST}`, async () => {
          const { status } = await request(testApp)
            .post(SERVICE_TOKEN_ROUTER_ROOT)
            .send({ ...VALID_BODY_NO_EXPIRY, daysValid: "not a number" });
          expect(status).toEqual(STATUSES.BAD_REQUEST);
        });
      });
    });

    describe("when there is an error creating the service token", () => {
      beforeEach(() => {
        jest
          .spyOn(serviceTokenController, "create")
          .mockResolvedValue(undefined);
      });

      test(`should return ${STATUSES.ERROR}`, async () => {
        const { status } = await request(testApp)
          .post(SERVICE_TOKEN_ROUTER_ROOT)
          .send(VALID_BODY_NO_EXPIRY);
        expect(status).toEqual(STATUSES.ERROR);
      });
    });

    describe("when the service token fails to be created", () => {
      beforeEach(() => {
        jest.spyOn(serviceTokenController, "create").mockResolvedValue(null);
      });

      test(`should return ${STATUSES.ERROR}`, async () => {
        const { status } = await request(testApp)
          .post(SERVICE_TOKEN_ROUTER_ROOT)
          .send(VALID_BODY_NO_EXPIRY);
        expect(status).toEqual(STATUSES.ERROR);
      });
    });

    describe("when the service token is created", () => {
      const isValueAround = (value: number, expected: number): boolean => {
        const possible = [expected - 1, expected, expected + 1];
        return possible.some((x) => x === value);
      };

      let spy: jest.SpyInstance;

      beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date());
      });

      beforeEach(() => {
        spy = jest
          .spyOn(serviceTokenController, "create")
          .mockResolvedValue(TEST_SERVICE_TOKEN);
      });

      afterEach(() => {
        spy.mockReset();
      });

      describe("with no expiry param given", () => {
        test("should use the default days valid", async () => {
          await request(testApp)
            .post(SERVICE_TOKEN_ROUTER_ROOT)
            .send(VALID_BODY_NO_EXPIRY);
          const daysValid = differenceInDays(
            spy.mock.calls[0][0].Expires,
            new Date()
          );
          expect(isValueAround(daysValid, DEFAULT_DAYS_VALID)).toEqual(true);
        });
      });

      describe("with an expiry param given", () => {
        test("should use the given days valid", async () => {
          await request(testApp)
            .post(SERVICE_TOKEN_ROUTER_ROOT)
            .send(VALID_BODY_WITH_EXPIRY);
          const daysValid = differenceInDays(
            spy.mock.calls[0][0].Expires,
            new Date()
          );
          expect(
            isValueAround(daysValid, VALID_BODY_WITH_EXPIRY.daysValid)
          ).toEqual(true);
        });
      });

      test(`should return ${STATUSES.CREATED}`, async () => {
        const { status } = await request(testApp)
          .post(SERVICE_TOKEN_ROUTER_ROOT)
          .send(VALID_BODY_NO_EXPIRY);
        expect(status).toEqual(STATUSES.CREATED);
      });
    });
  });
});
