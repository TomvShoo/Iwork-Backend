import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from "../../common/enums/rol.enum";
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

export function Auth() {
    return applyDecorators(
        // Roles(Role.USER), //aqui quiero poner el rol que se escoja en el registro
        UseGuards(AuthGuard, RolesGuard)
    )
} 