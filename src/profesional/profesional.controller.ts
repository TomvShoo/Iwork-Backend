import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UploadedFile, UseInterceptors, Query, HttpException, HttpStatus, NotFoundException, Req, UseGuards } from '@nestjs/common';
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
  deleteProfesional(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalService.deleteProfesional(id)
  }

  @Get('id/:id')
  async getProfesionalById(@Param('id') profesionalId: number) {
    return this.profesionalService.getProfesional(profesionalId);
  }

  @Get('search')
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
        await this.profesionalService.deleteProfesion(profesionalId, profesion);
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
  async eliminarProfesion(
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

// @Patch(':id')
// async updateProfesional(@Param('id', ParseIntPipe) id: number, @Body() profesionalData: CreateProfesionalDto) {
//   try {
//     const updateProfesional = await this.profesionalService.updateProfesional(id, profesionalData)
//     if (!updateProfesional) {
//       throw new NotFoundException('No se Encontro al profesional');
//     }
//     return updateProfesional;
//   } catch (error) {
//     throw new NotFoundException('No se pudo actualizar al profesional');
//   }
// }

// @Post('asignar-profesion/:profesionId')
// async asignarProfesion(
  //   @Param('profesionId') profesionId: number,
  //   @Req() req: Request,
  // ): Promise<any> {
  //   try {
  //     const { authorization } = req.headers;
  //     const token = authorization.split(' ')[1];

  //     const decodedToken = this.jwtService.decode(token);

  //     if (typeof decodedToken === 'string') {
  //       return {
  //         message: 'Error en el token',
  //       };
  //     }

  //     const profesionalId = decodedToken.id;

  //     const profesional = await this.profesionalService.findById(profesionalId);
  //     const profesion = await this.profesionService.findById(profesionId);

  //     if (profesional && profesion) {
  //       if (!profesional.tipoProfesion) {
  //         profesional.tipoProfesion = [];
  //       }
  //       profesional.addProfesion([profesion[0]]); // Asegúrate de obtener la primera profesión del array
  //       await this.profesionalService.updateProfesional(profesionalId, profesional);
  //       return { message: 'Profesión asignada con éxito' };
  //     } else {
  //       return { message: 'No se pudo encontrar el profesional o la profesión' };
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     throw new Error('No se pudo asignar la profesión');
  //   }
  // }





  // @Get(':id')
  // getProfesional(@Param('id', ParseIntPipe) id: number) {
  //   return this.profesionalService.getProfesional(id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProfesionalDto: UpdateProfesionalDto) {
  //   return this.profesionalService.updateProfesional(+id, updateProfesionalDto);
  // 
  

  // @Delete('eliminar-profesion/:profesionId')
  // async eliminarProfesion(@Param('profesionId') profesionId: number,
  //   @Req() req: Request,): Promise<any> {
  //   try {
  //     const { authorization } = req.headers;
  //     const token = authorization.split(' ')[1];

  //     const decodedToken = this.jwtService.decode(token);

  //     if (typeof decodedToken === 'string') {
  //       return {
  //         message: 'Error en el token',
  //       };
  //     }

  //     const profesionalId = decodedToken.id;
  //     const removedProfesion = await this.profesionService.findById(profesionId);

  //     const response = await this.profesionalService.deleteProfesion(profesionalId, removedProfesion)

  //     if (!profesionalId) {
  //       return {
  //         message: 'El ID del profesional no se encontró en el token',
  //       };
  //     }

  //     if (response) {
  //       return { message: 'profesion eliminada' };
  //     } else {
  //       return { message: 'profesion no asignada al profesional' }
  //     }
  //     // const profesional = await this.profesionalService.findById(profesionalId);
  //     // const profesion = await this.profesionService.findById(profesionId);

  //     // if (profesional && profesion) {
  //     //   const removedProfesiones = profesional.tipoProfesion.filter(
  //     //     (prof) => prof.id_profesion === profesionId
  //     //   );
  //     //   if (removedProfesiones.length > 0) {
  //     //     await this.profesionalService.deleteProfesion(profesionalId, removedProfesiones);
  //     //     return { message: 'Profesion eliminada' };
  //     //   } else {
  //     //     return { message: 'Profesion no asignada al profesional' }
  //     //   }
  //     // } else {
  //     //   return { message: 'Error al encontrar al profesional o la profesion' }
  //     // }

  //     // if (profesional) {
  //     //   const index = profesional.tipoProfesion.findIndex(
  //     //     (profesion) => profesion.id_profesion === profesionId
  //     //   );
  //     //   if (index !== -1) {
  //     //     const removedProfesiones = [profesional.tipoProfesion[index]]
  //     //     profesional.tipoProfesion.splice(index, 1);
  //     //     await this.profesionalService.deleteProfesion(profesionalId, removedProfesiones)
  //     //     return { message: 'Profesion eliminada' };
  //     //   } else {
  //     //     return { message: 'Esta profesion no esta asignada al profesional' };
  //     //   }
  //     // } else {
  //     //   return { message: 'No se encuentra al profesional' };
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Error al eliminar la profesion')
  //   };
  // }