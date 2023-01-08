import {
  InsertStatement,
  SelectStatement,
  mockInsert,
  mockSelect,
  UpdateStatement,
  mockUpdate,
} from "musqrat";
import controller from "../../src/controllers/service.controller";
import Service, { IService } from "../../src/schemas/service.schema";
import TestLogger from "../data/test-logger";
import { TEST_SERVICE } from "../data/test-service";

const TEST_LOGGER = new TestLogger();
const GENERIC_ERROR = "Generic Error";

describe("[CLASS]: ServiceController", () => {
  describe("[METHOD]: constructor", () => {});

  describe("[METHOD]: create", () => {
    let insertSpy: jest.SpyInstance<InsertStatement<IService>>;

    afterEach(() => {
      insertSpy.mockRestore();
    });

    describe("when there is an error creating a service", () => {
      beforeEach(() => {
        insertSpy = mockInsert<IService>(
          Service,
          [TEST_SERVICE],
          GENERIC_ERROR
        );
      });

      test("should return undefined", async () => {
        const result = await controller.create(TEST_SERVICE);
        expect(result).toEqual(undefined);
      });
    });

    describe("when creating a valid service", () => {
      beforeEach(() => {
        insertSpy = mockInsert<IService>(Service, [TEST_SERVICE]);
      });

      test("should return the created service", async () => {
        const result = await controller.create(TEST_SERVICE);
        expect(result).toEqual({
          ...TEST_SERVICE,
          Service_Id: expect.any(String),
        });
      });
    });
  });

  describe("[METHOD]: deactivate", () => {
    const now = new Date();
    let updateSpy: jest.SpyInstance<UpdateStatement<IService, "Service_Id">>;

    afterEach(() => {
      updateSpy.mockRestore();
    });

    describe("when there is an error deactivating", () => {
      beforeEach(() => {
        updateSpy = mockUpdate<IService, "Service_Id">(
          Service,
          [{ field: "Deactivated", value: now }],
          [TEST_SERVICE],
          GENERIC_ERROR
        );
      });

      it("should return undefined", async () => {
        const result = await controller.deactivate("id", now);
        expect(result).toEqual(undefined);
      });
    });

    describe("when there are no services to deactivate", () => {
      beforeEach(() => {
        updateSpy = mockUpdate<IService, "Service_Id">(
          Service,
          [{ field: "Deactivated", value: now }],
          []
        );
      });

      it("should return null", async () => {
        const result = await controller.deactivate("id", now);
        expect(result).toEqual(null);
      });
    });

    describe("when a service is deactivated", () => {
      const updated = { Service_Id: TEST_SERVICE.Service_Id, Deactivated: now };
      beforeEach(() => {
        updateSpy = mockUpdate<IService, "Service_Id">(
          Service,
          [{ field: "Deactivated", value: now }],
          [updated]
        );
      });

      it("should return the service", async () => {
        const result = await controller.deactivate(
          TEST_SERVICE.Service_Id,
          now
        );
        expect(result).toEqual({
          Service_Id: updated.Service_Id,
          Deactivated: updated.Deactivated,
        });
      });
    });
  });

  describe("[METHOD]: find", () => {
    let selectSpy: jest.SpyInstance<SelectStatement<IService>>;

    afterEach(() => {
      selectSpy.mockRestore();
    });

    describe("when there is an error getting the service", () => {
      beforeEach(() => {
        selectSpy = mockSelect<IService, "Service_Id">(Service, [], "Error");
      });

      test("should throw an error", async () => {
        const result = await controller.find("id");
        expect(result).toEqual(undefined);
      });
    });

    describe("when the service does not exist", () => {
      beforeEach(() => {
        selectSpy = mockSelect<IService, "Service_Id">(Service);
      });

      test("should return null", async () => {
        const result = await controller.find("id");
        expect(result).toEqual(null);
      });
    });

    describe("when the service exists", () => {
      beforeEach(() => {
        selectSpy = mockSelect<IService, "Service_Id">(Service, TEST_SERVICE);
      });

      test("should return an empty array", async () => {
        const result = await controller.find("id");
        expect(result).toEqual(TEST_SERVICE);
      });
    });
  });

  describe("[METHOD]: query", () => {
    let selectSpy: jest.SpyInstance<SelectStatement<IService>>;

    afterEach(() => {
      selectSpy.mockRestore();
    });

    describe("when there is an error getting the services", () => {
      beforeEach(() => {
        selectSpy = mockSelect<IService, "Service_Id">(
          Service,
          [],
          GENERIC_ERROR
        );
      });

      test("should return undefined", async () => {
        const result = await controller.query();
        expect(result).toEqual(undefined);
      });
    });

    describe("when there are no services", () => {
      beforeEach(() => {
        selectSpy = mockSelect<IService, "Service_Id">(Service, []);
      });

      test("should return an empty array", async () => {
        const result = await controller.query();
        expect(result).toEqual([]);
      });
    });

    describe("when there are services", () => {
      beforeEach(() => {
        selectSpy = mockSelect<IService, "Service_Id">(Service, [
          TEST_SERVICE,
          TEST_SERVICE,
          TEST_SERVICE,
        ]);
      });

      test("should return an array of services", async () => {
        const result = await controller.query();
        expect(result).toEqual([TEST_SERVICE, TEST_SERVICE, TEST_SERVICE]);
      });
    });
  });

  describe("[METHOD]: update", () => {
    let updateSpy: jest.SpyInstance<UpdateStatement<IService, "Service_Id">>;

    afterEach(() => {
      updateSpy.mockRestore();
    });

    describe("when there is an error updating", () => {
      beforeEach(() => {
        updateSpy = mockUpdate<IService, "Service_Id">(
          Service,
          [{ field: "Name", value: "another" }],
          [TEST_SERVICE],
          GENERIC_ERROR
        );
      });

      it("should return undefined", async () => {
        const result = await controller.update("id", { Name: "another" });
        expect(result).toEqual(undefined);
      });
    });

    describe("when there are no updates made", () => {
      beforeEach(() => {
        updateSpy = mockUpdate<IService, "Service_Id">(
          Service,
          [{ field: "Name", value: "another" }],
          []
        );
      });

      it("should return null", async () => {
        const result = await controller.update("id", {
          Name: "another",
        });
        expect(result).toEqual(null);
      });
    });

    describe("when an update is made", () => {
      const updated = { Service_Id: TEST_SERVICE.Service_Id, Name: "another" };
      beforeEach(() => {
        updateSpy = mockUpdate<IService, "Service_Id">(
          Service,
          [{ field: "Name", value: "another" }],
          [updated]
        );
      });

      it("should return the updated service", async () => {
        const result = await controller.update(TEST_SERVICE.Service_Id, {
          Name: "another",
        });
        expect(result).toEqual(updated);
      });
    });

    it("should return null when there are no valid updates", async () => {
      const result = await controller.update("id", {});
      expect(result).toEqual(null);
    });
  });
});
