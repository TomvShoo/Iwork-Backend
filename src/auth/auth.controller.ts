import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decoratorts';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

interface RequestWithUser extends Request {
    user: {
        correo: string;
        role: string;
    }
}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService,) { }

    @Post('register')
    register(
        @Body()
        registerDto: RegisterDto,) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto,) {
        return this.authService.login(loginDto);
    }

    @Get('perfil')
    @Auth()
    @UseGuards(AuthGuard, RolesGuard)
    async profile(@ActiveUser() user: UserActiveInterface) {
        if (user.role === Role.CLIENTE) {
            return await this.authService.profileCli({ correo: user.correo, role: 'cliente' });
        } else if (user.role === Role.PROFESIONAL) {
            return await this.authService.profilePro({ correo: user.correo, role: 'profesional' });
        }
    }
}
