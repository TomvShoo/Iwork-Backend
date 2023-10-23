import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfesionalService } from 'src/profesional/profesional.service';
import { ProfesionModule } from 'src/profesion/profesion.module';
@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly profesionalService: ProfesionalService,
    ) { }

    createToken(payload: any): string {
        return this.jwtService.sign(payload);
    }

    async register({ nombre, apellido, correo, contrasena, nroTelefono, tipoCuenta }: RegisterDto) {
        const user = await this.userService.findOneByEmail(correo);

        if (user) {
            throw new BadRequestException('Usuario ya existe');
        }

        let newUser;
        if (tipoCuenta === 'cliente') {
            newUser = await this.userService.createUser({
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
            profesionalId: newUser.profesionalId,
        }
    }

    async login({ correo, contrasena, tipoCuenta }: LoginDto) {
        let user;
        let userId;

        if (tipoCuenta === 'cliente') {
            user = await this.userService.findOneByEmail(correo);
            if (user) {
                userId = user.id;
            }
        } else if (tipoCuenta === 'profesional') {
            user = await this.profesionalService.findOneByEmail(correo);
            if (user) {
                userId = user.profesionalId;
            }
        } else {
            throw new BadRequestException('Tipo de cuenta no válido');
        }

        if (!user) {
            throw new UnauthorizedException('Correo es incorrecto o no existe');
        }

        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Contrasena es incorrecta');
        }

        if (user.tipoCuenta !== tipoCuenta) {
            throw new UnauthorizedException('No tienes permisos para iniciar sesión con este tipo de cuenta');
        }

        const payload = {
            id: userId,
            correo: user.correo,
            role: user.tipoCuenta,
        };
        const token = await this.jwtService.signAsync(payload);

        return {
            success: true,
            data: token,
        }
    }

    async profileCli({ correo, role }: { correo: string; role: string; }) {
        if (role === 'cliente') {
            return await this.userService.findOneByEmail(correo);
        } else if (role === 'profesional') {
            return await this.profesionalService.findOneByEmail(correo)
        } else {
            throw new UnauthorizedException('Tipo de usuario no valido');
        }
    }

    async profilePro({ correo, role }: { correo: string; role: string; }) {
        if (role === 'cliente') {
            return await this.userService.findOneByEmail(correo);
        } else if (role === 'profesional') {
            return await this.profesionalService.findOneByEmail(correo)
        } else {
            throw new UnauthorizedException('Tipo de usuario no valido');
        }
    }
}