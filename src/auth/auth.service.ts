import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfesionalService } from 'src/profesional/profesional.service';
@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly profesionalService: ProfesionalService,
    ) {}

    async register({ nombre, apellido, correo, contrasena, nroTelefono, tipoCuenta }: RegisterDto) {
        const user = await this.userService.findOneByEmail(correo); 
        
        if(user) {
            throw new BadRequestException('Usuario ya existe');
        }

        let newUser;
        if (tipoCuenta === 'cliente') {
            newUser =  await this.userService.createUser({ 
                nombre, 
                apellido,
                nroTelefono, 
                correo, 
                contrasena: await bcrypt.hash(contrasena, 10),
                tipoCuenta,
            });
        } else if (tipoCuenta === 'profesional') {
            newUser = await this.profesionalService.createProfesional({
                nombre,
                apellido,
                nroTelefono,
                correo,
                contrasena: await bcrypt.hash(contrasena, 10),
                tipoCuenta,
            });
        } else {
            throw new BadRequestException('Tipo de cuenta no valido');
        }
        
        return {
            success: true,
            nombre,
            correo,
        }
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

        const payload = { correo: user.correo, role: user.tipoCuenta };
        const token =  await this.jwtService.signAsync(payload);

        return {
            success: true,
            data: token
        };
    }

    async profile({ correo, role }: {correo: string; role: string;}) {
        
        return await this.userService.findOneByEmail(correo);
    } 
}