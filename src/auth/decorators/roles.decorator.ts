import { SetMetadata } from "@nestjs/common";
import { Role } from "src/common/enums/rol.enum";

export const ROLES_KEY =  'roles'
// export const Roles = (role) => SetMetadata(ROLES_KEY, role);
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);