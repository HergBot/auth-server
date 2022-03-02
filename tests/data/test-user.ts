import { IUser } from "../../src/schemas/user.schema";

const now = new Date();

export const TEST_USER: IUser = {
    User_Id: 1,
    Service_Id: 1,
    Username: "TestUser",
    Email: "user@test.com",
    Created: now,
};

export const DEACTIVATED_USER: IUser = {
    User_Id: 1,
    Service_Id: 1,
    Username: "TestUser",
    Email: "user@test.com",
    Created: now,
    Deactivated: now,
};
