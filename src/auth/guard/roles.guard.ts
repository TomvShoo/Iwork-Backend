import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/enums/rol.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  
  constructor(private readonly reflector: Reflector,
              private readonly jwtService: JwtService,) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean  {

    const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
 
    if (!role) {
      return true;
    };    

    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
      return false;
    }

    const tokenData = this.jwtService.decode(token);

    if(typeof tokenData == 'string') {
      return false;
    }
    console.log({role, rol: tokenData.role});
    
    return role.includes(tokenData.role);
    // return Array.isArray(tokenData.role) ? tokenData.role.includes(role): role === tokenData.role;
    // return role == tokenData.role
    
    // const { user } = context.switchToHttp().getRequest();
    // console.log(user);
    
    // if (user.role === Role.ADMIN) {
    //   return true;
    // }

    // return role === user.role;
  }
}
