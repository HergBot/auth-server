import { NextFunction, Request, Response } from "express";

import sessionController from "../../src/controllers/session.controller";
import userController from "../../src/controllers/user.controller";
import { authenticateToken } from "../../src/middleware/authentication.middleware";
import { TEST_AUTHORIZATION_TOKEN } from "../data/test-data";
import {
    DEACTIVATED_SESSION,
    EXPIRED_SESSION,
    TEST_SESSION,
} from "../data/test-session";
import { DEACTIVATED_USER, TEST_USER } from "../data/test-user";

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
                    jest.spyOn(sessionController, "find").mockResolvedValue(
                        undefined
                    );
                });

                test("should return a 500", async () => {
                    await callMiddleware();
                    expect(status).toEqual(500);
                });
            });

            describe("when no session is found", () => {
                beforeEach(() => {
                    jest.spyOn(sessionController, "find").mockResolvedValue(
                        null
                    );
                });

                test("should return a 401", async () => {
                    await callMiddleware();
                    expect(status).toEqual(401);
                });
            });

            describe("when the session is deactivated", () => {
                beforeEach(() => {
                    jest.spyOn(sessionController, "find").mockResolvedValue(
                        DEACTIVATED_SESSION
                    );
                });

                test("should return a 401", async () => {
                    await callMiddleware();
                    expect(status).toEqual(401);
                });
            });

            describe("when the session is expired", () => {
                beforeEach(() => {
                    jest.spyOn(sessionController, "find").mockResolvedValue(
                        EXPIRED_SESSION
                    );
                });

                test("should return a 401", async () => {
                    await callMiddleware();
                    expect(status).toEqual(401);
                });
            });

            describe("with a valid session", () => {
                beforeEach(() => {
                    jest.spyOn(sessionController, "find").mockResolvedValue(
                        TEST_SESSION
                    );
                });

                describe("when there is an error getting the user", () => {
                    beforeEach(() => {
                        jest.spyOn(userController, "find").mockResolvedValue(
                            undefined
                        );
                    });

                    test("should return a 500", async () => {
                        await callMiddleware();
                        expect(status).toEqual(500);
                    });
                });

                describe("when no user is found", () => {
                    beforeEach(() => {
                        jest.spyOn(userController, "find").mockResolvedValue(
                            null
                        );
                    });

                    test("should return a 401", async () => {
                        await callMiddleware();
                        expect(status).toEqual(401);
                    });
                });

                describe("when the user is deactivated", () => {
                    beforeEach(() => {
                        jest.spyOn(userController, "find").mockResolvedValue(
                            DEACTIVATED_USER
                        );
                    });

                    test("should return a 403", async () => {
                        await callMiddleware();
                        expect(status).toEqual(403);
                    });
                });

                describe("with a valid user", () => {
                    beforeEach(() => {
                        jest.spyOn(userController, "find").mockResolvedValue(
                            TEST_USER
                        );
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
});
