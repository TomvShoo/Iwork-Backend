import { Transform } from "class-transformer";
import { IsString, IsEmail, MinLength, IsNumber, MaxLength, Length } from "class-validator";

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
    @Length(8, 8, { message: 'El número de teléfono debe tener exactamente 8 caracteres' })
    nroTelefono: string;
    
    @IsString()
    @MinLength(8)
    contrasena: string;
}