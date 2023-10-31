import { IsString } from "class-validator";

export class CreateAdminDto {
    @IsString()
    correo: string;

    @IsString()
    contrasena: string
}
