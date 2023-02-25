import { isValid, parseISO } from "date-fns";

type MatchIdsSignature = {
  (a: Buffer, b: Buffer): Boolean;
  (a: Buffer, b: string): Boolean;
};

export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;

export const parseDate = (str: string): Date | undefined => {
  const parsed = parseISO(str);
  return isValid(parsed) ? parsed : undefined;
};

export const matchIds: MatchIdsSignature = (a, b): Boolean => {
  const otherBuffer = typeof b === "string" ? Buffer.from(b, "hex") : b;
  return a.compare(otherBuffer) === 0;
};
