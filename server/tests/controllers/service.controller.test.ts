import { InsertStatement, SelectStatement } from "musqrat/dist/statement";
import { mockInsert, mockSelect } from "musqrat/dist/testing";
import ServiceController from "../../src/controllers/service.controller";
import Service, { IService } from "../../src/schemas/service.schema";
import TestLogger from "../data/test-logger";
import { TEST_SERVICE } from "../data/test-service";

const TEST_LOGGER = new TestLogger();

describe("ServiceController", () => {
    let controller: ServiceController;

    beforeEach(() => {
        controller = new ServiceController(TEST_LOGGER);
    });

    describe("constructor", () => {});

    describe("createService", () => {
        let insertSpy: jest.SpyInstance<InsertStatement<IService>>;

        beforeEach(() => {
            insertSpy = mockInsert<IService>(Service, [TEST_SERVICE]);
        });

        afterEach(() => {
            insertSpy.mockRestore();
        });

        test("create a valid service", async () => {
            const result = await controller.createService(TEST_SERVICE);
            expect(result).toEqual([TEST_SERVICE]);
        });
    });

    describe("getService", () => {
        let selectSpy: jest.SpyInstance<SelectStatement<IService, any[]>>;

        describe("when the service does not exist", () => {
            beforeEach(() => {
                selectSpy = mockSelect<IService, "Service_Id", any[]>(
                    Service,
                    null
                );
            });

            afterEach(() => {
                selectSpy.mockRestore();
            });

            test("should return an empty array", async () => {
                const result = await controller.getService(1);
                expect(result).toHaveLength(0);
            });
        });

        describe("when the service exists", () => {
            beforeEach(() => {
                selectSpy = mockSelect<IService, "Service_Id", any[]>(
                    Service,
                    TEST_SERVICE
                );
            });

            afterEach(() => {
                selectSpy.mockRestore();
            });

            test("should return an empty array", async () => {
                const result = await controller.getService(1);
                expect(result).toEqual(TEST_SERVICE);
            });
        });
    });

    describe("getServices", () => {});
});
