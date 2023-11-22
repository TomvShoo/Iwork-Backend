import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfesionalService } from 'src/profesional/profesional.service';
import { ProfesionModule } from 'src/profesion/profesion.module';
import { User } from 'src/users/user.entity';
import { AdminService } from 'src/admin/admin.service';
@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly profesionalService: ProfesionalService,
        private readonly adminService: AdminService,
    ) { }

    createToken(payload: any): string {
        return this.jwtService.sign(payload);
    }

    async register({ nombre, apellido, correo, contrasena, nroTelefono, tipoCuenta }: RegisterDto) {
        const userExist = await this.userService.findOneByEmail(correo);
        const profesionalExist = await this.profesionalService.findOneByEmail(correo);

        if (userExist || profesionalExist) {
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

    async login({ correo, contrasena }: LoginDto) {
        let user = await this.userService.findOneByEmail(correo);
        let userId;
        let tipoCuenta;

        if (!user) {
            user = await this.profesionalService.findOneByEmail(correo);
            if (user) {
                userId = user.id;
                tipoCuenta = 'profesional';
            } else {
                const admin = await this.adminService.findOneByEmail(correo);
                if (admin) {
                    if (contrasena !== admin.contrasena) {
                        throw new UnauthorizedException('Contraseña es incorrecta para el ADMIN')                        
                    }
                    user = admin;
                    userId = admin.id;
                    tipoCuenta = 'admin';
                    user.contrasena = await bcrypt.hash(contrasena, 10);
                }
            }            
        } else {
            userId = user.id;
            tipoCuenta = 'cliente';
        }

        if (!user) {
            throw new UnauthorizedException('Correo es incorrecto o no existe');
        }

        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Contrasena es incorrecta');
        }

        if (tipoCuenta === 'profesional' && !user.tipoCuenta) {
            throw new UnauthorizedException('El usuario no tiene un tipo de cuenta definido');
        }

        if (tipoCuenta === 'cliente' && user.tipoCuenta !== 'cliente') {
            throw new UnauthorizedException('No tienes permisos para iniciar sesión con este tipo de cuenta');
        }

        const payload = {
            id: userId,
            correo: user.correo,
            role: tipoCuenta,
        };
        const token = await this.jwtService.signAsync(payload);

        return {
            success: true,
            data: token,
        }
    }

    async profileCli({ correo, role }: { correo: string; role: string; }) {
        return await this.userService.findOneByEmail(correo);
    }


    async profilePro({ correo, role }: { correo: string; role: string; }) {
        return await this.profesionalService.findOneByEmail(correo)
       
    }
    
}