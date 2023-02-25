import { Request } from "express";
import { isNil } from "lodash";

export const anyHeaders = (req: Request): boolean => {
  return !isNil(req.headers);
};

export const hasHeader = (req: Request, header: string): Boolean => {
  return !isNil(req.headers) && !isNil(req.headers[header]);
};

export const getBinaryHeader = (
  req: Request,
  header: string
): Buffer | null => {
  const value = req.get(header);
  return isNil(value) ? null : Buffer.from(value, "hex");
};

export const getBinaryParam = (req: Request, key: string): Buffer | null => {
  const value = req.params[key];
  return isNil(value) ? null : Buffer.from(value, "hex");
};

export const getBinaryBody = (req: Request, key: string): Buffer | null => {
  const value = req.body[key];
  return isNil(value) ? null : Buffer.from(value, "hex");
};
