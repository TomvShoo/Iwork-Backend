import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ProfesionalService } from './profesional.service';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { Profesional } from './entities/profesional.entity';
import { ProfesionService } from 'src/profesion/profesion.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfesionalDto } from './dto/update-profesional.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('profesional')
export class ProfesionalController {
  constructor(private profesionalService: ProfesionalService,
    private profesionService: ProfesionService,
    private readonly jwtService: JwtService,) { }

  @Get()
  getProfesionals(): Promise<Profesional[]> {
    return this.profesionalService.getProfesionals()
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteProfesional(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalService.deleteProfesional(id)
  }

  @Get('id/:id')
  @Roles(Role.PROFESIONAL, Role.CLIENTE)
  async getProfesionalById(@Param('id', ParseIntPipe) profesionalId: number) { // @Req() profesionalId: Request AGREGAR O IMPLEMENTAR ESTO
    return this.profesionalService.getProfesional(profesionalId); // user.id
  }

  @Get('search')
  @Roles(Role.CLIENTE)
  async searchProfesionales(@Query('query') query: string) {
    if (!query) {
      return new HttpException('Please provide a valid search query.', HttpStatus.BAD_REQUEST);
    }

    const profesionales = await this.profesionalService.searchProfesionales(query);
    const resultados = await Promise.all(
      profesionales.map(async (profesional) => {
        if (profesional.tipoProfesion && profesional.tipoProfesion.length > 0) {
          const profesionesAsignadas = profesional.tipoProfesion.map((profesion) => {
            return {
              id_profesion: profesion.id_profesion,
              nombre_profesion: profesion.nombre_profesion,
            };
          });
          return {
            id: profesional.id,
            nombre: profesional.nombre,
            apellido: profesional.apellido,
            correo: profesional.correo,
            nroTelefono: profesional.nroTelefono,
            tipoProfesion: profesionesAsignadas,
          };
        } else {
          return {
            id: profesional.id,
            nombre: profesional.nombre,
            apellido: profesional.apellido,
            correo: profesional.correo,
            nroTelefono: profesional.nroTelefono,
            tipoProfesion: [],
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
  @Roles(Role.PROFESIONAL)
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
        await this.profesionalService.addProfesion(profesionalId, profesion);
        return { message: 'Profesión asignada con éxito' };
      } else {
        return { message: 'No se pudo encontrar el profesional o la profesión' };
      }

    } catch (error) {
      console.log(error.message);
      throw new Error('No se pudo asignar la profesión');
    }
  }

  @Patch('eliminar-profesion/:profesionId')
  @Roles(Role.PROFESIONAL)
  async eliminarProfesion(
    @Param('profesionId') profesionId: number,
    @Req() req: Request, // 
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
      const response = await this.profesionalService.eliminarProfesion(profesionalId, profesionId);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error('Error al eliminar la profesion');
    }
  }
  
  @Patch(':id')
  @Roles(Role.PROFESIONAL)
  updateProfesional(@Param('id', ParseIntPipe) id: number, @Body()
  profesional: UpdateProfesionalDto) {
    return this.profesionalService.updateProfesional(id, profesional)
  }
}