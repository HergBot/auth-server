import bcrypt from "bcrypt";

import logger from "../lib/console-logger";
import { PasswordVersion } from "../schemas/password.schema";

export const CURRENT_PASSWORD_VERSION: PasswordVersion = "v1";

export const generateSalt = async (
  version: PasswordVersion
): Promise<string | undefined> => {
  try {
    switch (version) {
      case "v1":
        return bcrypt.genSalt();
    }
  } catch (err) {
    logger.exception(err, "generateSalt");
    logger.error(
      `Failed to generate a salt with password version '${CURRENT_PASSWORD_VERSION}'`
    );
    return undefined;
  }
};

export const hashPassword = async (
  password: string,
  salt: string,
  version: PasswordVersion
): Promise<string | undefined> => {
  try {
    switch (version) {
      case "v1":
        return bcrypt.hash(password, salt);
    }
  } catch (err) {
    logger.exception(err, "hashPassword");
    logger.error(
      `Failed to hash a password with password version '${CURRENT_PASSWORD_VERSION}'`
    );
    return undefined;
  }
};

export const verifyPassword = async (
  password: string,
  salt: string,
  version: PasswordVersion,
  hash: string
): Promise<boolean> => {
  try {
    switch (version) {
      case "v1":
        return bcrypt.compare(password, hash);
    }
  } catch (err) {
    logger.exception(err, "verifyPassword");
    logger.error(
      `Failed to verify a password with password version '${CURRENT_PASSWORD_VERSION}'`
    );
    return false;
  }
};
