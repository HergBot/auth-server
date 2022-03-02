import { isValid, parse, parseISO } from "date-fns";

export const getKeys = Object.keys as <T extends object>(
    obj: T
) => Array<keyof T>;

export const parseDate = (str: string): Date | undefined => {
    const parsed = parseISO(str);
    return isValid(parsed) ? parsed : undefined;
};
