import Role from "./role.enum";

export type JwtPayload = {
    name: string;
    email: string;
    role: Role;
}