import {
  InsertStatement,
  SelectStatement,
  mockInsert,
  mockSelect,
  UpdateStatement,
  mockUpdate,
} from "musqrat";
import controller from "../../src/controllers/session.controller";
import Session, { ISession } from "../../src/schemas/session.schema";
import { TEST_ID } from "../data/test-data";
import TestLogger from "../data/test-logger";
import { TEST_SESSION } from "../data/test-session";

const TEST_LOGGER = new TestLogger();
const GENERIC_ERROR = "Generic Error";

describe("[CLASS]: SessionController", () => {
  describe("[METHOD]: constructor", () => {});

  describe("[METHOD]: create", () => {
    let insertSpy: jest.SpyInstance<InsertStatement<ISession>>;

    afterEach(() => {
      insertSpy.mockRestore();
    });

    describe("when there is an error creating a session", () => {
      beforeEach(() => {
        insertSpy = mockInsert<ISession>(
          Session,
          [TEST_SESSION],
          GENERIC_ERROR
        );
      });

      test("should return undefined", async () => {
        const result = await controller.create(TEST_SESSION);
        expect(result).toEqual(undefined);
      });
    });

    describe("when creating a valid session", () => {
      beforeEach(() => {
        insertSpy = mockInsert<ISession>(Session, [TEST_SESSION]);
      });

      test("should return the created session", async () => {
        const result = await controller.create(TEST_SESSION);
        expect(result).toEqual({
          ...TEST_SESSION,
          Session_Id: expect.any(String),
        });
      });
    });
  });

  describe("[METHOD]: deactivate", () => {
    const now = new Date();
    let updateSpy: jest.SpyInstance<UpdateStatement<ISession, "Session_Id">>;

    afterEach(() => {
      updateSpy.mockRestore();
    });

    describe("when there is an error deactivating", () => {
      beforeEach(() => {
        updateSpy = mockUpdate<ISession, "Session_Id">(
          Session,
          [{ field: "Deactivated", value: now }],
          [TEST_SESSION],
          GENERIC_ERROR
        );
      });

      it("should return undefined", async () => {
        const result = await controller.deactivate(TEST_ID, now);
        expect(result).toEqual(undefined);
      });
    });

    describe("when there are no sessions to deactivate", () => {
      beforeEach(() => {
        updateSpy = mockUpdate<ISession, "Session_Id">(
          Session,
          [{ field: "Deactivated", value: now }],
          []
        );
      });

      it("should return null", async () => {
        const result = await controller.deactivate(TEST_ID, now);
        expect(result).toEqual(null);
      });
    });

    describe("when a session is deactivated", () => {
      const updated: Partial<ISession> = {
        Session_Id: TEST_SESSION.Session_Id,
        Deactivated: now,
      };
      beforeEach(() => {
        updateSpy = mockUpdate<ISession, "Session_Id">(
          Session,
          [{ field: "Deactivated", value: now }],
          [updated]
        );
      });

      it("should return the session", async () => {
        const result = await controller.deactivate(
          TEST_SESSION.Session_Id,
          now
        );
        console.log(result?.Session_Id?.toString("hex"));
        expect(result).toEqual(updated);
      });
    });
  });

  describe("[METHOD]: find", () => {
    let selectSpy: jest.SpyInstance<SelectStatement<ISession>>;

    afterEach(() => {
      selectSpy.mockRestore();
    });

    describe("when there is an error getting the session", () => {
      beforeEach(() => {
        selectSpy = mockSelect<ISession, "Session_Id">(Session, [], "Error");
      });

      test("should throw an error", async () => {
        const result = await controller.find(TEST_ID);
        expect(result).toEqual(undefined);
      });
    });

    describe("when the session does not exist", () => {
      beforeEach(() => {
        selectSpy = mockSelect<ISession, "Session_Id">(Session);
      });

      test("should return null", async () => {
        const result = await controller.find(TEST_ID);
        expect(result).toEqual(null);
      });
    });

    describe("when the session exists", () => {
      beforeEach(() => {
        selectSpy = mockSelect<ISession, "Session_Id">(Session, TEST_SESSION);
      });

      test("should return an empty array", async () => {
        const result = await controller.find(TEST_ID);
        expect(result).toEqual(TEST_SESSION);
      });
    });
  });

  describe("[METHOD]: query", () => {
    let selectSpy: jest.SpyInstance<SelectStatement<ISession>>;

    afterEach(() => {
      selectSpy.mockRestore();
    });

    describe("when there is an error getting the sessions", () => {
      beforeEach(() => {
        selectSpy = mockSelect<ISession, "Session_Id">(
          Session,
          [],
          GENERIC_ERROR
        );
      });

      test("should return undefined", async () => {
        const result = await controller.query();
        expect(result).toEqual(undefined);
      });
    });

    describe("when there are no sessions", () => {
      beforeEach(() => {
        selectSpy = mockSelect<ISession, "Session_Id">(Session, []);
      });

      test("should return an empty array", async () => {
        const result = await controller.query();
        expect(result).toEqual([]);
      });
    });

    describe("when there are sessions", () => {
      beforeEach(() => {
        selectSpy = mockSelect<ISession, "Session_Id">(Session, [
          TEST_SESSION,
          TEST_SESSION,
          TEST_SESSION,
        ]);
      });

      test("should return an array of sessions", async () => {
        const result = await controller.query();
        expect(result).toEqual([TEST_SESSION, TEST_SESSION, TEST_SESSION]);
      });
    });
  });

  describe("[METHOD]: update", () => {
    const now = new Date();
    let updateSpy: jest.SpyInstance<UpdateStatement<ISession, "Session_Id">>;

    afterEach(() => {
      updateSpy.mockRestore();
    });

    describe("when there is an error updating", () => {
      beforeEach(() => {
        updateSpy = mockUpdate<ISession, "Session_Id">(
          Session,
          [{ field: "Deactivated", value: new Date() }],
          [TEST_SESSION],
          GENERIC_ERROR
        );
      });

      it("should return undefined", async () => {
        const result = await controller.update(TEST_ID, {
          Deactivated: new Date(),
        });
        expect(result).toEqual(undefined);
      });
    });

    describe("when there are no updates made", () => {
      beforeEach(() => {
        updateSpy = mockUpdate<ISession, "Session_Id">(
          Session,
          [{ field: "Deactivated", value: new Date() }],
          []
        );
      });

      it("should return null", async () => {
        const result = await controller.update(TEST_ID, {
          Deactivated: new Date(),
        });
        expect(result).toEqual(null);
      });
    });

    describe("when an update is made", () => {
      const updated: Partial<ISession> = {
        Session_Id: TEST_SESSION.Session_Id,
        Expires: now,
      };
      beforeEach(() => {
        updateSpy = mockUpdate<ISession, "Session_Id">(
          Session,
          [{ field: "Expires", value: now }],
          [updated]
        );
      });

      it("should return the updated session", async () => {
        const result = await controller.update(TEST_SESSION.Session_Id, {
          Expires: now,
        });
        expect(result).toEqual(updated);
      });
    });

    it("should return null when there are no valid updates", async () => {
      const result = await controller.update(TEST_ID, {});
      expect(result).toEqual(null);
    });
  });
});
