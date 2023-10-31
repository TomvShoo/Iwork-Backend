import { IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    nombre?: string

    @IsOptional()
    @IsString()
    apellido?: string

    @IsOptional()
    @IsString()
    correo?: string

    @IsOptional()
    @IsString()
    contrasena?: string
}