import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PassThrough } from 'stream';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register({ nombre, apellido, correo, contrasena }: RegisterDto) {
        return await this.userService.createUser({ 
            nombre, 
            apellido, 
            correo, 
            contrasena: await bcrypt.hash(contrasena, 10)
        });
    }

    async login({ correo, contrasena }: LoginDto) {
        const user = await this.userService.findOneByEmail(correo);
        if(!user){
            throw new UnauthorizedException('Correo es incorrecto o no existe');
        }

        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
        if(!isPasswordValid){
            throw new UnauthorizedException('Contrasena es incorrecta');
        }

        const payload = { correo: user.correo };
        const token =  await this.jwtService.signAsync(payload);

        return {
            token,
            correo
        };
    }

}
