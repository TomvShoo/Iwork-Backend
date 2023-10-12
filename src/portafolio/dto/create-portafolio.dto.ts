import { IsBase64, IsNumber, IsString } from 'class-validator'

export class CreatePortafolioDto {
    @IsString()
    descripcion: string;
    
    @IsString()
    certificaciones: string;
    
    @IsBase64()
    imagen: string;
}
