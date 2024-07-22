import Role from "./role.enum";
import HttpException from "../execptions/http.exceptions";
import { RequestWithUser } from "./requestWithUser";
export const Permission = {
    employeePermission: (req: RequestWithUser, rolesArray: Role[], messageArray: Array<string> = []) => {
        const rolePerson = String(req.role);
        const stringRolesArray = rolesArray.map((role) => String(role));

        console.log(rolePerson, stringRolesArray);
        if (!stringRolesArray.includes(rolePerson)) {
            throw new HttpException(403, "Forbidden", messageArray);
        }
        console.log("authorized person accessing this");
    },
};

export default Permission;
