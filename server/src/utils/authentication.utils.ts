import { PasswordVersion } from "../schemas/password.schema";

export const CURRENT_PASSWORD_VERSION: PasswordVersion = "v1";

export const hashPassword = (
    password: string,
    salt: string,
    version: PasswordVersion
): string => {
    switch (version) {
        default:
            return "";
    }
};

export const verifyPassword = (
    password: string,
    salt: string,
    version: PasswordVersion,
    hash: string
): boolean => {
    return hash === hashPassword(password, salt, version);
};
