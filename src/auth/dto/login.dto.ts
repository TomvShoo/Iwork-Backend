import { IsEmail, IsString, MinLength } from "class-validator";


export class LoginDto {
    @IsEmail()
    correo: string;

    @IsString()
    @MinLength(8)
    contrasena: string;

    @IsString() // Agrega validación para el tipo de cuenta
    tipoCuenta: string;
}