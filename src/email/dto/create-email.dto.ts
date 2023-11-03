import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateEmailDto {
    @IsNotEmpty()
    @IsEmail()
    recipient: string;

    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}
