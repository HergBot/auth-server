import {
    InsertStatement,
    SelectStatement,
    mockInsert,
    mockSelect,
} from "musqrat";
import ServiceController from "../../src/controllers/service.controller";
import Service, { IService } from "../../src/schemas/service.schema";
import TestLogger from "../data/test-logger";
import { TEST_SERVICE } from "../data/test-service";

const TEST_LOGGER = new TestLogger();
const GENERIC_ERROR = "Generic Error";

describe("ServiceController", () => {
    let controller: ServiceController;

    beforeEach(() => {
        controller = new ServiceController(TEST_LOGGER);
    });

    describe("constructor", () => {});

    describe("createService", () => {
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

            test("create a valid service", async () => {
                const result = await controller.create(TEST_SERVICE);
                expect(result).toEqual(undefined);
            });
        });

        describe("when creating a valid service", () => {
            beforeEach(() => {
                insertSpy = mockInsert<IService>(Service, [TEST_SERVICE]);
            });

            test("create a valid service", async () => {
                const result = await controller.create(TEST_SERVICE);
                expect(result).toEqual([TEST_SERVICE]);
            });
        });
    });

    describe("getService", () => {
        let selectSpy: jest.SpyInstance<SelectStatement<IService>>;

        afterEach(() => {
            selectSpy.mockRestore();
        });

        describe("when there is an error getting the service", () => {
            beforeEach(() => {
                selectSpy = mockSelect<IService, "Service_Id">(
                    Service,
                    [],
                    "Error"
                );
            });

            test("should throw an error", async () => {
                const result = await controller.get(1);
                expect(result).toEqual(undefined);
            });
        });

        describe("when the service does not exist", () => {
            beforeEach(() => {
                selectSpy = mockSelect<IService, "Service_Id">(Service);
            });

            test("should return null", async () => {
                const result = await controller.get(1);
                expect(result).toEqual(null);
            });
        });

        describe("when the service exists", () => {
            beforeEach(() => {
                selectSpy = mockSelect<IService, "Service_Id">(
                    Service,
                    TEST_SERVICE
                );
            });

            test("should return an empty array", async () => {
                const result = await controller.get(1);
                expect(result).toEqual(TEST_SERVICE);
            });
        });
    });

    describe("getServices", () => {
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
                expect(result).toEqual([
                    TEST_SERVICE,
                    TEST_SERVICE,
                    TEST_SERVICE,
                ]);
            });
        });
    });
});
