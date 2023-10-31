import { IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    nombre: string;

    @IsString()
    apellido: string;

    @IsString()
    correo: string;

    @IsString()
    contrasena: string;

    @IsNumber()
    nroTelefono: string;

    @IsString()
    tipoCuenta: string;
}