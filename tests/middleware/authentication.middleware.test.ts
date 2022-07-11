import { NextFunction, Request, Response } from "express";
import { HEADERS, STATUSES } from "../../src/constants/request.constants";
import serviceTokenController from "../../src/controllers/service-token.controller";
import serviceController from "../../src/controllers/service.controller";

import sessionController from "../../src/controllers/session.controller";
import userRoleController from "../../src/controllers/user-role.controller";
import userController from "../../src/controllers/user.controller";
import {
  authenticateHergBotAdminToken,
  authenticateServiceForService,
  authenticateServiceForUser,
  authenticateServiceToken,
  authenticateToken,
  ServiceAuthenticatedResponse,
} from "../../src/middleware/authentication.middleware";
import { TEST_AUTHORIZATION_TOKEN } from "../data/test-data";
import { DEACTIVATED_SERVICE, TEST_SERVICE } from "../data/test-service";
import {
  DEACTIVATED_SERVICE_TOKEN,
  EXPIRED_SERVICE_TOKEN,
  TEST_SERVICE_TOKEN,
} from "../data/test-service-token";
import {
  DEACTIVATED_SESSION,
  EXPIRED_SESSION,
  TEST_SESSION,
} from "../data/test-session";
import {
  DEACTIVATED_USER,
  HERGBOT_AUTH_ADMIN_USER,
  HERGBOT_AUTH_NON_ADMIN_USER,
  TEST_USER,
} from "../data/test-user";

describe("[FILE]: authentication.middleware", () => {
  describe("[FUNCTION]: authenticateToken", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;
    let status: Number;

    const callMiddleware = async (): Promise<void> => {
      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    };

    beforeEach(() => {
      mockRequest = {
        path: "/authentication-middleware/test",
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

    describe("when the headers are not set", () => {
      test("should return a 403", async () => {
        await callMiddleware();
        expect(status).toEqual(403);
      });
    });

    describe("when there is no token in the request", () => {
      beforeEach(() => {
        mockRequest = {
          ...mockRequest,
          headers: {},
        };
      });
      test("should return a 403", async () => {
        await callMiddleware();
        expect(status).toEqual(403);
      });
    });

    describe("with a valid token", () => {
      beforeEach(() => {
        mockRequest = {
          ...mockRequest,
          headers: {
            authorization: TEST_AUTHORIZATION_TOKEN,
          },
        };
      });

      describe("when there is an error getting the session", () => {
        beforeEach(() => {
          jest.spyOn(sessionController, "find").mockResolvedValue(undefined);
        });

        test("should return a 500", async () => {
          await callMiddleware();
          expect(status).toEqual(500);
        });
      });

      describe("when no session is found", () => {
        beforeEach(() => {
          jest.spyOn(sessionController, "find").mockResolvedValue(null);
        });

        test("should return a 401", async () => {
          await callMiddleware();
          expect(status).toEqual(401);
        });
      });

      describe("when the session is deactivated", () => {
        beforeEach(() => {
          jest
            .spyOn(sessionController, "find")
            .mockResolvedValue(DEACTIVATED_SESSION);
        });

        test("should return a 401", async () => {
          await callMiddleware();
          expect(status).toEqual(401);
        });
      });

      describe("when the session is expired", () => {
        beforeEach(() => {
          jest
            .spyOn(sessionController, "find")
            .mockResolvedValue(EXPIRED_SESSION);
        });

        test("should return a 401", async () => {
          await callMiddleware();
          expect(status).toEqual(401);
        });
      });

      describe("with a valid session", () => {
        beforeEach(() => {
          jest.spyOn(sessionController, "find").mockResolvedValue(TEST_SESSION);
        });

        describe("when there is an error getting the user", () => {
          beforeEach(() => {
            jest.spyOn(userController, "find").mockResolvedValue(undefined);
          });

          test("should return a 500", async () => {
            await callMiddleware();
            expect(status).toEqual(500);
          });
        });

        describe("when no user is found", () => {
          beforeEach(() => {
            jest.spyOn(userController, "find").mockResolvedValue(null);
          });

          test("should return a 401", async () => {
            await callMiddleware();
            expect(status).toEqual(401);
          });
        });

        describe("when the user is deactivated", () => {
          beforeEach(() => {
            jest
              .spyOn(userController, "find")
              .mockResolvedValue(DEACTIVATED_USER);
          });

          test("should return a 403", async () => {
            await callMiddleware();
            expect(status).toEqual(403);
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
  });

  describe("[FUNCTION]: authenticateHergBotAdminToken", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response> & { locals: Record<string, any> };
    let nextFunction: NextFunction;
    let status: Number;

    const callMiddleware = async (): Promise<void> => {
      await authenticateHergBotAdminToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    };

    beforeEach(() => {
      mockRequest = {
        path: "/authentication-middleware/test",
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

    describe("when no user value exists on locals", () => {
      test("should return a 500", async () => {
        await callMiddleware();
        expect(status).toEqual(500);
      });
    });

    describe("when a user value exists on locals", () => {
      describe("when the user is not registered to the HergBot Auth Service", () => {
        beforeEach(() => {
          // Add the user to the locals
          mockResponse.locals.user = TEST_USER;
        });

        test("should return a 403", async () => {
          await callMiddleware();
          expect(status).toEqual(403);
        });
      });

      describe("when the user is registered to the HergBot Auth Service", () => {
        beforeEach(() => {
          // Add the user to the locals
          mockResponse.locals.user = HERGBOT_AUTH_NON_ADMIN_USER;
        });

        describe("when there is an error getting the user role", () => {
          beforeEach(() => {
            jest.spyOn(userRoleController, "find").mockResolvedValue(undefined);
          });

          test("should return a 500", async () => {
            await callMiddleware();
            expect(status).toEqual(500);
          });
        });

        describe("when the user does not have the admin role for the HergBot Auth Service", () => {
          beforeEach(() => {
            jest.spyOn(userRoleController, "find").mockResolvedValue(null);
          });

          test("should return a 403", async () => {
            await callMiddleware();
            expect(status).toEqual(403);
          });
        });

        describe("when the user has the admin role for the HergBot Auth Service", () => {
          beforeEach(() => {
            // Add the user to the locals
            mockResponse.locals.user = HERGBOT_AUTH_ADMIN_USER;
          });

          beforeEach(() => {
            jest.spyOn(userRoleController, "find").mockResolvedValue({
              User_Id: HERGBOT_AUTH_ADMIN_USER.User_Id,
              Role_Id: HERGBOT_AUTH_ADMIN_USER.Service_Id,
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

  describe("[FUNCTION]: authenticateServiceToken", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response> & { locals: Record<string, any> };
    let nextFunction: NextFunction;
    let status: Number;

    const callMiddleware = async (): Promise<void> => {
      await authenticateServiceToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    };

    beforeEach(() => {
      mockRequest = {
        path: "/authentication-middleware/test",
        get: jest.fn(),
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

    describe("when there are no headers", () => {
      test("should return 403", async () => {
        await callMiddleware();
        expect(status).toEqual(403);
      });
    });

    describe("when there is no service token header", () => {
      beforeEach(() => {
        mockRequest.headers = {
          randomHeader: "some header",
        };
      });

      test("should return 403", async () => {
        await callMiddleware();
        expect(status).toEqual(403);
      });
    });

    describe("when there is a valid service token header", () => {
      beforeEach(() => {
        mockRequest.headers = {
          [HEADERS.HERGBOT_SERVICE_TOKEN]: "service_token",
        };
      });

      describe("when there is an error finding the service token", () => {
        beforeEach(() => {
          jest
            .spyOn(serviceTokenController, "find")
            .mockResolvedValue(undefined);
        });

        test("should return 500", async () => {
          await callMiddleware();
          expect(status).toEqual(500);
        });
      });

      describe("when the service token is not found", () => {
        beforeEach(() => {
          jest.spyOn(serviceTokenController, "find").mockResolvedValue(null);
        });

        test("should return 403", async () => {
          await callMiddleware();
          expect(status).toEqual(403);
        });
      });

      describe("when the service token is deactivated", () => {
        beforeEach(() => {
          jest
            .spyOn(serviceTokenController, "find")
            .mockResolvedValue(DEACTIVATED_SERVICE_TOKEN);
        });

        test("should return 403", async () => {
          await callMiddleware();
          expect(status).toEqual(403);
        });
      });

      describe("when the service token is expired", () => {
        beforeEach(() => {
          jest
            .spyOn(serviceTokenController, "find")
            .mockResolvedValue(EXPIRED_SERVICE_TOKEN);
        });

        test("should return 401", async () => {
          await callMiddleware();
          expect(status).toEqual(401);
        });
      });

      describe("when the service token is valid", () => {
        beforeEach(() => {
          jest
            .spyOn(serviceTokenController, "find")
            .mockResolvedValue(TEST_SERVICE_TOKEN);
        });

        describe("when there is an error getting the service", () => {
          beforeEach(() => {
            jest.spyOn(serviceController, "find").mockResolvedValue(undefined);
          });

          test("should return 500", async () => {
            await callMiddleware();
            expect(status).toEqual(500);
          });
        });

        describe("when no service is found", () => {
          beforeEach(() => {
            jest.spyOn(serviceController, "find").mockResolvedValue(null);
          });

          test("should return 403", async () => {
            await callMiddleware();
            expect(status).toEqual(403);
          });
        });

        describe("when the service is deactivated", () => {
          beforeEach(() => {
            jest
              .spyOn(serviceController, "find")
              .mockResolvedValue(DEACTIVATED_SERVICE);
          });

          test("should return 403", async () => {
            await callMiddleware();
            expect(status).toEqual(403);
          });
        });

        describe("when the service is valid", () => {
          beforeEach(() => {
            jest
              .spyOn(serviceController, "find")
              .mockResolvedValue(TEST_SERVICE);
          });

          test("should attach the service to locals", async () => {
            await callMiddleware();
            expect(mockResponse.locals.service).toBeDefined();
          });

          test("should call the next function", async () => {
            await callMiddleware();
            expect(nextFunction).toBeCalled();
          });
        });
      });
    });
  });

  describe("[FUNCTION]: authenticateServiceForService", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<ServiceAuthenticatedResponse>;
    let nextFunction: NextFunction;
    let status: Number;

    const callMiddleware = async (): Promise<void> => {
      await authenticateServiceForService(
        mockRequest as Request,
        mockResponse as ServiceAuthenticatedResponse,
        nextFunction
      );
    };

    beforeEach(() => {
      mockRequest = {
        path: "/authentication-middleware/test",
      };
      mockResponse = {
        status: (code: Number): ServiceAuthenticatedResponse => {
          status = code;
          return mockResponse as ServiceAuthenticatedResponse;
        },
        locals: {},
        send: jest.fn(),
      };
      nextFunction = jest.fn();
    });

    describe("when a service is not included in locals", () => {
      test("should return 403", async () => {
        await callMiddleware();
        expect(status).toEqual(403);
      });
    });

    describe("when a service is included in locals", () => {
      beforeEach(() => {
        mockResponse.locals = { service: TEST_SERVICE };
      });

      describe("when a service id is not included in the body", () => {
        beforeEach(() => {
          mockRequest.body = {};
        });

        test("should return 403", async () => {
          await callMiddleware();
          expect(status).toEqual(403);
        });
      });

      describe("when the service id does not match the service id of the service token", () => {
        beforeEach(() => {
          mockRequest.body = { serviceId: "wrongid" };
        });

        test("should return 403", async () => {
          await callMiddleware();
          expect(status).toEqual(403);
        });
      });

      describe("when the service id matches the service id of the token", () => {
        beforeEach(() => {
          mockRequest.body = { serviceId: TEST_SERVICE.Service_Id };
        });

        test("should call the next function", async () => {
          await callMiddleware();
          expect(nextFunction).toBeCalled();
        });
      });
    });
  });

  describe("[FUNCTION]: authenticateServiceForUser", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<ServiceAuthenticatedResponse>;
    let nextFunction: NextFunction;
    let status: Number;

    const callMiddleware = async (): Promise<void> => {
      await authenticateServiceForUser(
        mockRequest as Request,
        mockResponse as ServiceAuthenticatedResponse,
        nextFunction
      );
    };

    beforeEach(() => {
      mockRequest = {
        path: "/authentication-middleware/test",
      };
      mockResponse = {
        status: (code: Number): ServiceAuthenticatedResponse => {
          status = code;
          return mockResponse as ServiceAuthenticatedResponse;
        },
        locals: {},
        send: jest.fn(),
      };
      nextFunction = jest.fn();
    });

    describe("when a service is not included in locals", () => {
      test(`should return ${STATUSES.FORBIDDEN}`, async () => {
        await callMiddleware();
        expect(status).toEqual(STATUSES.FORBIDDEN);
      });
    });

    describe("when a service is included in locals", () => {
      beforeEach(() => {
        mockResponse.locals = { service: TEST_SERVICE };
      });

      describe("when a user is not included in locals", () => {
        test(`should return ${STATUSES.FORBIDDEN}`, async () => {
          await callMiddleware();
          expect(status).toEqual(STATUSES.FORBIDDEN);
        });
      });
    });

    describe("when a service and user is included in locals", () => {
      describe("when the user does not belong to the service", () => {
        beforeEach(() => {
          mockResponse.locals = {
            service: TEST_SERVICE,
            user: { ...TEST_USER, service: -300 },
          };
        });

        test(`should return ${STATUSES.FORBIDDEN}`, async () => {
          await callMiddleware();
          expect(status).toEqual(STATUSES.FORBIDDEN);
        });
      });

      describe("when the user belongs to the service", () => {
        beforeEach(() => {
          mockResponse.locals = {
            service: TEST_SERVICE,
            user: { ...TEST_USER, service: TEST_SERVICE.Service_Id },
          };
        });

        test("should call the next function", async () => {
          await callMiddleware();
          expect(nextFunction).toBeCalled();
        });
      });
    });
  });
});
