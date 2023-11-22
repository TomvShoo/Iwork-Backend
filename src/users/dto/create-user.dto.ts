import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    apellido: string;

    @IsNotEmpty()
    @IsString()
    correo: string;

    @IsNotEmpty()
    @IsString()
    contrasena: string;

    @IsNotEmpty()
    @IsNumber()
    nroTelefono: string;

    @IsNotEmpty()
    @IsString()
    tipoCuenta: string;
}