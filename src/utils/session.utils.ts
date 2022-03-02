import { addHours } from "date-fns";
import { MAX_SESSION_LENGTH } from "../controllers/session.controller";

export const validateSessionExpiry = (expires: Date): boolean => {
    const now = new Date();
    const maxEpiry = addHours(now, MAX_SESSION_LENGTH);
    return (
        expires.valueOf() > now.valueOf() &&
        expires.valueOf() <= maxEpiry.valueOf()
    );
};
