import ServiceController from "../../src/controllers/service.controller";
import Service from "../../src/schemas/service.schema";
import TestLogger from "../data/test-logger";

jest.mock("../../src/schemas/service.schema");
jest.mock("../data/test-logger");

const TEST_LOGGER = new TestLogger();

describe("ServiceController", () => {
    let controller;

    beforeEach(() => {
        controller = new ServiceController(TEST_LOGGER);
    });

    describe("constructor", () => {});

    describe("createService", () => {
        beforeEach(() => {
            Service.insert.mockResolvedValue;
        });
    });

    describe("getService", () => {});

    describe("getServices", () => {});
});
