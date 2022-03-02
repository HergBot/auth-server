import { parseDate } from "../../src/utils/common.utils";

describe("[FILE]: common.utils", () => {
    describe("[FUNCTION]: parseDate", () => {
        test("should return undefined for an empty value", () => {
            const result = parseDate("");
            expect(result).toEqual(undefined);
        });

        test("should return undefined for an invalid value", () => {
            const result = parseDate("just a string");
            expect(result).toEqual(undefined);
        });

        test("should return undefined for an improperly formatted value", () => {
            const result = parseDate("2022/03/02");
            expect(result).toEqual(undefined);
        });

        test("should return a date for an ISO formatted date string", () => {
            const now = new Date();
            const result = parseDate(now.toISOString());
            expect(result).toEqual(now);
        });
    });
});
