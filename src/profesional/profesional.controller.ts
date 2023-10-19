import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UploadedFile, UseInterceptors, Query, HttpException, HttpStatus, Req } from '@nestjs/common';
import { ProfesionalService } from './profesional.service';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { UpdateProfesionalDto } from './dto/update-profesional.dto';
import { Profesional } from './entities/profesional.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ProfesionService } from 'src/profesion/profesion.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

// @Auth(Role.PROFESIONAL)
@Controller('profesional')
export class ProfesionalController {
  constructor(private profesionalService: ProfesionalService,
    private profesionService: ProfesionService,
    private readonly jwtService: JwtService,) { }

  @Get()
  async getProfesionales() {
    return this.profesionalService.getProfesionals();
  }

  @Get('search')
  async searchProfesionales(@Query('query') query: string) {
    if (!query) {
      return new HttpException('Please provide a valid search query.', HttpStatus.BAD_REQUEST);
    }

    const profesionales = await this.profesionalService.searchProfesionales(query);

    // Iterar sobre cada profesional y obtener su profesión si está definida
    const resultados = await Promise.all(
      profesionales.map(async (profesional) => {
        if (profesional.tipoProfesion && profesional.tipoProfesion.length > 0) {
          const profesion = await this.profesionService.findById(profesional.tipoProfesion[0].id_profesion); // Asigna el primer tipo de profesión

          // Devuelve el objeto con la profesión incluida
          return {
            id: profesional.profesionalId,
            nombre: profesional.nombre,
            apellido: profesional.apellido,
            correo: profesional.correo,
            nroTelefono: profesional.nroTelefono,
            tipoProfesion: profesion, // Asegúrate de ajustar el nombre del campo según tu modelo de datos
          };
        } else {
          // Devuelve el objeto sin la profesión si no está definida
          return {
            id: profesional.profesionalId,
            nombre: profesional.nombre,
            apellido: profesional.apellido,
            correo: profesional.correo,
            nroTelefono: profesional.nroTelefono,
            tipoProfesion: null, // O cualquier otro valor predeterminado apropiado
          };
        }
      })
    );

    return resultados;
  }

  @Post()
  createUser(@Body() NewProfesional: CreateProfesionalDto) {
    return this.profesionalService.createProfesional(NewProfesional)
  }

  @Post('asignar-profesion/:profesionId')
  async asignarProfesion(
    @Param('profesionId') profesionId: number,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const { authorization } = req.headers;
      const token = authorization.split(' ')[1];

      const decodedToken = this.jwtService.decode(token);

      if (typeof decodedToken === 'string') {
        return {
          message: 'Error en el token',
        };
      }

      const profesionalId = decodedToken.id;

      const profesional = await this.profesionalService.findById(profesionalId);
      const profesion = await this.profesionService.findById(profesionId);

      if (profesional && profesion) {
        profesional.tipoProfesion = [profesion];
        await this.profesionalService.update(profesional);
        return { message: 'Profesión asignada con éxito' };
      } else {
        return { message: 'No se pudo encontrar el profesional o la profesión' };
      }
    } catch (error) {
      console.log(error.message);
      throw new Error('No se pudo asignar la profesión');
    }
  }



  @Get()
  getProfesionals(): Promise<Profesional[]> {
    return this.profesionalService.getProfesionals()
  }

  @Get(':id')
  getProfesional(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalService.getProfesional(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfesionalDto: UpdateProfesionalDto) {
    return this.profesionalService.updateProfesional(+id, updateProfesionalDto);
  }

  @Delete(':id')
  deleteProfesional(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalService.deleteProfesional(id)
  }

}

