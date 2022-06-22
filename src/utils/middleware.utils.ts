import { Request } from "express";
import { isNil } from "lodash";

export const anyHeaders = (req: Request): boolean => {
  return !isNil(req.headers);
};

export const hasHeader = (req: Request, header: string) => {
    return !isNil(req.headers) && !isNil(req.headers[header]);
}
