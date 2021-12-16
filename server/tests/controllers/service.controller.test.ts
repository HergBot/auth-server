import { InsertStatement } from "musqrat/dist/statement";
import ServiceController from "../../src/controllers/service.controller";
import Service from "../../src/schemas/service.schema";
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
        beforeEach(() => {
            jest.spyOn(InsertStatement.prototype, "exec").mockImplementation(
                () => Promise.resolve([TEST_SERVICE])
            );
        });

        test("test stub", async () => {
            const res = await controller.createService(TEST_SERVICE);
            console.log(res);
        });
    });

    describe("getService", () => {});

    describe("getServices", () => {});
});
