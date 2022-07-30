import { NextFunction, Request, Response } from "express";
import { STATUSES } from "../../src/constants/request.constants";
import serviceController from "../../src/controllers/service.controller";
import userController from "../../src/controllers/user.controller";
import {
  attachServiceData,
  attachUserData,
} from "../../src/middleware/data.middleware";
import { DEACTIVATED_SERVICE, TEST_SERVICE } from "../data/test-service";
import { DEACTIVATED_USER, TEST_USER } from "../data/test-user";

describe("[FILE]: data.middleware", () => {
  describe("[FUNCTION]: attachUserData", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;
    let status: Number;

    const callMiddleware = async (): Promise<void> => {
      await attachUserData(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    };

    beforeEach(() => {
      mockRequest = {
        path: "/data-middleware/test",
        body: {},
      };
      mockResponse = {
        status: (code: Number): Response => {
          status = code;
          return mockResponse as Response;
        },
        locals: {},
        send: jest.fn(),
      };
      nextFunction = jest.fn();
    });

    describe("when the body params are not set", () => {
      test(`should return a ${STATUSES.BAD_REQUEST}`, async () => {
        await callMiddleware();
        expect(status).toEqual(STATUSES.BAD_REQUEST);
      });
    });

    describe("with a valid body", () => {
      beforeEach(() => {
        mockRequest = {
          ...mockRequest,
          body: {
            userId: TEST_USER.User_Id,
          },
        };
      });

      describe("when there is an error getting the user", () => {
        beforeEach(() => {
          jest.spyOn(userController, "find").mockResolvedValue(undefined);
        });

        test(`should return a ${STATUSES.ERROR}`, async () => {
          await callMiddleware();
          expect(status).toEqual(STATUSES.ERROR);
        });
      });

      describe("when no user is found", () => {
        beforeEach(() => {
          jest.spyOn(userController, "find").mockResolvedValue(null);
        });

        test(`should return a ${STATUSES.UNPROCESSABLE}`, async () => {
          await callMiddleware();
          expect(status).toEqual(STATUSES.UNPROCESSABLE);
        });
      });

      describe("when the user is deactivated", () => {
        beforeEach(() => {
          jest
            .spyOn(userController, "find")
            .mockResolvedValue(DEACTIVATED_USER);
        });

        test(`should return a ${STATUSES.UNPROCESSABLE}`, async () => {
          await callMiddleware();
          expect(status).toEqual(STATUSES.UNPROCESSABLE);
        });
      });

      describe("with a valid user", () => {
        beforeEach(() => {
          jest.spyOn(userController, "find").mockResolvedValue(TEST_USER);
        });

        test("should attach the user to the response", async () => {
          await callMiddleware();
          expect(mockResponse.locals).toEqual({
            user: TEST_USER,
          });
        });

        test("should call the next function", async () => {
          await callMiddleware();
          expect(nextFunction).toBeCalled();
        });
      });
    });
  });

  describe("[FUNCTION]: attachServiceData", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;
    let status: Number;

    const callMiddleware = async (): Promise<void> => {
      await attachServiceData(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    };

    beforeEach(() => {
      mockRequest = {
        path: "/data-middleware/test",
        body: {},
      };
      mockResponse = {
        status: (code: Number): Response => {
          status = code;
          return mockResponse as Response;
        },
        locals: {},
        send: jest.fn(),
      };
      nextFunction = jest.fn();
    });

    describe("when the body params are not set", () => {
      test(`should return a ${STATUSES.BAD_REQUEST}`, async () => {
        await callMiddleware();
        expect(status).toEqual(STATUSES.BAD_REQUEST);
      });
    });

    describe("with a valid body", () => {
      beforeEach(() => {
        mockRequest = {
          ...mockRequest,
          body: {
            serviceId: TEST_SERVICE.Service_Id,
          },
        };
      });

      describe("when there is an error getting the service", () => {
        beforeEach(() => {
          jest.spyOn(serviceController, "find").mockResolvedValue(undefined);
        });

        test(`should return a ${STATUSES.ERROR}`, async () => {
          await callMiddleware();
          expect(status).toEqual(STATUSES.ERROR);
        });
      });

      describe("when no service is found", () => {
        beforeEach(() => {
          jest.spyOn(serviceController, "find").mockResolvedValue(null);
        });

        test(`should return a ${STATUSES.UNPROCESSABLE}`, async () => {
          await callMiddleware();
          expect(status).toEqual(STATUSES.UNPROCESSABLE);
        });
      });

      describe("when the service is deactivated", () => {
        beforeEach(() => {
          jest
            .spyOn(serviceController, "find")
            .mockResolvedValue(DEACTIVATED_SERVICE);
        });

        test(`should return a ${STATUSES.UNPROCESSABLE}`, async () => {
          await callMiddleware();
          expect(status).toEqual(STATUSES.UNPROCESSABLE);
        });
      });

      describe("with a valid service", () => {
        beforeEach(() => {
          jest.spyOn(serviceController, "find").mockResolvedValue(TEST_SERVICE);
        });

        test("should attach the service to the response", async () => {
          await callMiddleware();
          expect(mockResponse.locals).toEqual({
            service: TEST_SERVICE,
          });
        });

        test("should call the next function", async () => {
          await callMiddleware();
          expect(nextFunction).toBeCalled();
        });
      });
    });
  });
});
