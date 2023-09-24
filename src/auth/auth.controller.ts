import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Role } from './enums/rol.enum';
import { Auth } from './decorators/auth.decorator';

interface RequestWithUser extends Request {
    user: {
        correo: string;
        role: string;
    }
}


@Controller('auth')
export class AuthController {

    constructor( private readonly authService: AuthService,
        ) {}

    @Post('register')
    register(
        @Body()
        registerDto: RegisterDto, ) {
        return this.authService.register(registerDto);
    }
    
    @Post('login')
    login(@Body() loginDto: LoginDto, ) {
        return this.authService.login(loginDto);
    }

    // @Get('perfil')
    // @Roles(Role.USER)
    // @UseGuards(AuthGuard, RolesGuard)
    // profile(@Req() req: RequestWithUser) {
    //     return this.authService.profile(req.user)
    // }

    @Get('perfil')
    @Auth(Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    profile(@Req() req: RequestWithUser) {
        return this.authService.profile(req.user)
    }

}
