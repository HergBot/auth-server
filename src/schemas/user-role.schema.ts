import musqrat from "musqrat";

interface IUserRole {
  User_Id: number;
  Role_Id: number;
}

const UserRole = musqrat.initTable<IUserRole>("UserRole");

export default UserRole;
export { IUserRole };
