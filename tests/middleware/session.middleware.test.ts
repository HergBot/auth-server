import { addHours } from "date-fns";
import { NextFunction, Request, Response } from "express";

import sessionController, {
  MAX_SESSION_LENGTH,
} from "../../src/controllers/session.controller";
import userController from "../../src/controllers/user.controller";
import { UserAuthenticatedResponse } from "../../src/middleware/authentication.middleware";
import {
  authorizeForSession,
  authorizeForSessionUpdate,
  validateSessionUpdate,
} from "../../src/middleware/session.middleware";
import {
  SessionActionResponse,
  SessionUpdateResponse,
} from "../../src/routes/v1/session.routes";
import { TEST_AUTHORIZATION_TOKEN } from "../data/test-data";
import {
  DEACTIVATED_SESSION,
  EXPIRED_SESSION,
  TEST_SESSION,
} from "../data/test-session";
import { DEACTIVATED_USER, TEST_USER } from "../data/test-user";

describe("[FILE]: session.middleware", () => {
  describe("[FUNCTION]: authorizeForSession", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<UserAuthenticatedResponse>;
    let nextFunction: NextFunction;
    let status: Number;

    const callMiddleware = async (): Promise<void> => {
      await authorizeForSession(
        mockRequest as Request,
        mockResponse as UserAuthenticatedResponse,
        nextFunction
      );
    };

    beforeEach(() => {
      mockRequest = {
        path: "/session-middleware/test",
        params: {
          sessionId: TEST_SESSION.Session_Id,
        },
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

    describe("when the locals.user value is not set", () => {
      test("should return a 500", async () => {
        await callMiddleware();
        expect(status).toEqual(500);
      });
    });

    describe("when the locals.user value is set", () => {
      beforeEach(() => {
        mockResponse.locals = { ...mockResponse.locals, user: TEST_USER };
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

        test("should return a 404", async () => {
          await callMiddleware();
          expect(status).toEqual(404);
        });
      });

      describe("when no session is found", () => {
        beforeEach(() => {
          jest.spyOn(sessionController, "find").mockResolvedValue(null);
        });

        test("should return a 404", async () => {
          await callMiddleware();
          expect(status).toEqual(404);
        });
      });

      describe("when the session owner does not match the current user", () => {
        beforeEach(() => {
          jest
            .spyOn(sessionController, "find")
            .mockResolvedValue({ ...TEST_SESSION, User_Id: 1000 });
        });

        test("should return a 403", async () => {
          await callMiddleware();
          expect(status).toEqual(403);
        });
      });

      describe("when the session owner matches the current user", () => {
        beforeEach(() => {
          jest.spyOn(sessionController, "find").mockResolvedValue(TEST_SESSION);
        });

        test("should attach the session to the response", async () => {
          await callMiddleware();
          expect(mockResponse.locals).toEqual({
            user: TEST_USER,
            session: TEST_SESSION,
          });
        });

        test("should call the next function", async () => {
          await callMiddleware();
          expect(nextFunction).toBeCalled();
        });
      });
    });
  });

  describe("[FUNCTION]: validateSessionUpdate", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<SessionActionResponse>;
    let nextFunction: NextFunction;
    let status: Number;

    const callMiddleware = async (): Promise<void> => {
      await validateSessionUpdate(
        mockRequest as Request,
        mockResponse as SessionActionResponse,
        nextFunction
      );
    };

    beforeEach(() => {
      mockRequest = {
        path: "/session-middleware/test",
        params: {
          sessionId: TEST_SESSION.Session_Id,
        },
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

    describe("when the locals.session value is not set", () => {
      test("should return a 500", async () => {
        await callMiddleware();
        expect(status).toEqual(500);
      });
    });

    describe("when the locals.session value is set", () => {
      beforeEach(() => {
        mockResponse.locals = { ...mockResponse.locals, session: TEST_SESSION };
      });

      describe("when there is no refresh token", () => {
        beforeEach(() => {
          mockRequest.body = {};
        });

        test("should return a 400", async () => {
          await callMiddleware();
          expect(status).toEqual(400);
        });
      });

      describe("when there is an invalid expires value", () => {
        beforeEach(() => {
          const now = new Date();
          mockRequest.body = {
            refreshToken: TEST_SESSION.Refresh_Token,
            expires: addHours(now, MAX_SESSION_LENGTH + 100),
          };
        });

        test("should return a 400", async () => {
          await callMiddleware();
          expect(status).toEqual(400);
        });
      });

      describe("when there is no expires value", () => {
        beforeEach(() => {
          mockRequest.body = {
            refreshToken: TEST_SESSION.Refresh_Token,
          };
        });

        test("should attach the refresh token to the response", async () => {
          await callMiddleware();
          expect(mockResponse.locals).toEqual({
            session: TEST_SESSION,
            refreshToken: TEST_SESSION.Refresh_Token,
            expires: undefined,
          });
        });

        test("should call the next function", async () => {
          await callMiddleware();
          expect(nextFunction).toBeCalled();
        });
      });

      describe("when there is a valid expires value", () => {
        let expires: Date | null = null;
        beforeEach(() => {
          const now = new Date();
          expires = addHours(now, MAX_SESSION_LENGTH / 2);
          mockRequest.body = {
            refreshToken: TEST_SESSION.Refresh_Token,
            expires: expires.toISOString(),
          };
        });

        test("should attach the body data to the response", async () => {
          await callMiddleware();
          expect(mockResponse.locals).toEqual({
            session: TEST_SESSION,
            refreshToken: TEST_SESSION.Refresh_Token,
            expires: expires,
          });
        });

        test("should call the next function", async () => {
          await callMiddleware();
          expect(nextFunction).toBeCalled();
        });
      });
    });
  });

  describe("[FUNCTION]: authorizeForSessionUpdate", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<SessionUpdateResponse>;
    let nextFunction: NextFunction;
    let status: Number;

    const callMiddleware = async (): Promise<void> => {
      await authorizeForSessionUpdate(
        mockRequest as Request,
        mockResponse as SessionUpdateResponse,
        nextFunction
      );
    };

    beforeEach(() => {
      mockRequest = {
        path: "/session-middleware/test",
        params: {
          sessionId: TEST_SESSION.Session_Id,
        },
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

    describe("when the locals.user value is not set", () => {
      test("should return a 500", async () => {
        await callMiddleware();
        expect(status).toEqual(500);
      });
    });

    describe("when the locals.session value is not set", () => {
      beforeEach(() => {
        mockResponse.locals = { ...mockResponse.locals, user: TEST_USER };
      });
      test("should return a 500", async () => {
        await callMiddleware();
        expect(status).toEqual(500);
      });
    });

    describe("when the locals.refreshToken value is not set", () => {
      beforeEach(() => {
        mockResponse.locals = {
          ...mockResponse.locals,
          user: TEST_USER,
          session: TEST_SESSION,
        };
      });
      test("should return a 500", async () => {
        await callMiddleware();
        expect(status).toEqual(500);
      });
    });

    describe("when the locals values are set", () => {
      beforeEach(() => {
        mockResponse.locals = {
          ...mockResponse.locals,
          user: TEST_USER,
          session: TEST_SESSION,
          refreshToken: TEST_SESSION.Refresh_Token,
        };
      });

      describe("when the refresh token does not match the session", () => {
        beforeEach(() => {
          mockResponse.locals = {
            ...mockResponse.locals,
            session: { ...TEST_SESSION, Refresh_Token: "wrong_token" },
          };
        });

        test("should return a 403", async () => {
          await callMiddleware();
          expect(status).toEqual(403);
        });
      });

      describe("when there is a valid expires value", () => {
        beforeEach(() => {
          jest.spyOn(sessionController, "find").mockResolvedValue(TEST_SESSION);
        });

        test("should call the next function", async () => {
          await callMiddleware();
          expect(nextFunction).toBeCalled();
        });
      });
    });
  });
});
