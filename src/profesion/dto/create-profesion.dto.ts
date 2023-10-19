import { IsString } from "class-validator";

export class CreateProfesionDto {
    @IsString()
    nombre_profesion: string
}
