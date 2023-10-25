import { IsNumber, IsString } from "class-validator"

export class CreateReseñaDto {
    @IsNumber()
    calificacion: number;

    @IsString()
    resena: string;

    @IsNumber()
    profesionalId: number;
}
