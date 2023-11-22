import { IsNotEmpty, IsNumber, IsString, Validate, ValidationArguments  } from "class-validator"

// function IsNotOnlyWhitespace(value: string, validationArguments: ValidationArguments) {
//     if (!value || value.trim().length === 0) {
//         return false;
//     }
//     return true;
// }

export class CreateProfesionalDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    apellido: string;

    @IsNotEmpty()
    @IsString()
    correo: string;

    @IsNotEmpty()
    @IsString()
    contrasena: string;

    @IsNotEmpty()
    @IsNumber()
    nroTelefono: string;

    @IsNotEmpty()
    // @IsString()
    // @Validate(IsNotOnlyWhitespace, {
    //     message: "El campo '{{ property }}' no puede ser un espacio en blanco"
    // })
    tipoCuenta: string;
}
