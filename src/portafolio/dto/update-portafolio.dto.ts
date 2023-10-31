import { IsBase64, IsOptional, IsString } from "class-validator"

export class UpdatePortafolioDto {
    @IsOptional()
    @IsString()
    descripcion?: string

    @IsOptional()
    @IsString()
    certificaciones?: string

    @IsOptional()
    @IsBase64()
    imagen?: string;
}