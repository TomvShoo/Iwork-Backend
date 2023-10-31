import { IsNumber, IsString } from "class-validator"

export class CreateProfesionalDto {
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
