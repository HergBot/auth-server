import { addHours, subHours } from "date-fns";
import {
    MAX_SESSION_LENGTH,
    SESSION_LENGTH,
} from "../../src/controllers/session.controller";
import { validateSessionExpiry } from "../../src/utils/session.utils";

describe("[FILE]: session.utils", () => {
    describe("[FUNCTION]: validateSessionExpiry", () => {
        const now = new Date();
        test("should return false for a date before now", () => {
            const result = validateSessionExpiry(subHours(now, 2));
            expect(result).toEqual(false);
        });

        test("should return false for a date that is now", () => {
            const result = validateSessionExpiry(now);
            expect(result).toEqual(false);
        });

        test("should return false for a date that is over the max length", () => {
            const result = validateSessionExpiry(
                addHours(now, MAX_SESSION_LENGTH + 5)
            );
            expect(result).toEqual(false);
        });

        test("should return true for a date within the range", () => {
            const result = validateSessionExpiry(addHours(now, SESSION_LENGTH));
            expect(result).toEqual(true);
        });
    });
});
