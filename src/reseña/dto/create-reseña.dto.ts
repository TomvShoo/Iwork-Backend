import { IsEnum, IsNumber, IsString } from "class-validator"
import { TipoResena } from "../entities/reseña.entity";

export class CreateReseñaDto {
    @IsNumber()
    calificacion: number;

    @IsString()
    resena: string;

    @IsEnum(TipoResena)
    tipo: TipoResena;

    @IsNumber()
    profesionalId: number;
}
