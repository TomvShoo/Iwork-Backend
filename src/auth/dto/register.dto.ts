import { Transform } from "class-transformer";
import { IsString, IsEmail, MinLength } from "class-validator";

export class RegisterDto {

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @MinLength(1)
    apellido: string

    @IsEmail()
    correo: string;

    @IsString()
    @MinLength(8)
    contrasena: string;
}