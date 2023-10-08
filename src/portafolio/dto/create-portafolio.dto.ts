import { IsString } from 'class-validator'

export class CreatePortafolioDto {
    @IsString()
    descripcion: string
    @IsString()
    certificaciones: string
    @IsString()
    imagen: string
}
