import { matchIds, parseDate } from "../../src/utils/common.utils";

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

  describe("[FUNCTION]: matchIds", () => {
    test("should return true for 2 of the same values with buffers", () => {
      matchIds(
        Buffer.from("11EDB457D73D82A6ACE62CF05D559498", "hex"),
        Buffer.from("11EDB457D73D82A6ACE62CF05D559498", "hex")
      );
    });

    test("should return true for 2 of the same values with a buffer and string", () => {
      matchIds(
        Buffer.from("11EDB457D73D82A6ACE62CF05D559498", "hex"),
        "11EDB457D73D82A6ACE62CF05D559498"
      );
    });

    test("should return false for 2 different values with buffers", () => {
      matchIds(
        Buffer.from("11EDB457D73D82A6ACE62CF05D559498", "hex"),
        Buffer.from("1111111111", "hex")
      );
    });

    test("should return false for 2 different values with a buffer and string", () => {
      matchIds(
        Buffer.from("11EDB457D73D82A6ACE62CF05D559498", "hex"),
        "1111111111"
      );
    });
  });
});
