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

  // @Get('search')
  // async searchProfesionales(@Query('query') query: string) {
  //   if (!query) {
  //     return new HttpException('Please provide a valid search query.', HttpStatus.BAD_REQUEST);
  //   }

  //   const profesionales = await this.profesionalService.searchProfesionales(query);

  //   // Iterar sobre cada profesional y obtener todas las profesiones asignadas
  //   const resultados = await Promise.all(
  //     profesionales.map(async (profesional) => {
  //       if (profesional.tipoProfesion && profesional.tipoProfesion.length > 0) {
  //         const profesiones = await Promise.all(
  //           profesional.tipoProfesion.map(async (profesion) => {
  //             // return await this.profesionService.findById(profesion.id_profesion); // se sobreescribe la que esta
  //             // return await this.profesionService.findAllProfesion() // se le asignan todas
  //             return await this.profesionService.findAllProfesion();
  //           })
  //         );

  //         // Devuelve el objeto con todas las profesiones asignadas
  //         return {
  //           id: profesional.profesionalId,
  //           nombre: profesional.nombre,
  //           apellido: profesional.apellido,
  //           correo: profesional.correo,
  //           nroTelefono: profesional.nroTelefono,
  //           tipoProfesion: profesiones, // Asegúrate de ajustar el nombre del campo según tu modelo de datos
  //         };
  //       } else {
  //         // Devuelve el objeto sin la profesión si no está definida
  //         return {
  //           id: profesional.profesionalId,
  //           nombre: profesional.nombre,
  //           apellido: profesional.apellido,
  //           correo: profesional.correo,
  //           nroTelefono: profesional.nroTelefono,
  //           tipoProfesion: [], // O cualquier otro valor predeterminado apropiado
  //         };
  //       }
  //     })
  //   );

  //   return resultados;
  // }

  @Get('id/:profesionalId')
  async getProfesionalById(@Param('profesionalId') profesionalId: number) {
    return this.profesionalService.getProfesional(profesionalId);
  } // El metodo de abajo solo funciona si esto esta comentado ARREGLAR ESO

  @Get('search')
  async searchProfesionales(@Query('query') query: string) {
    if (!query) {
      return new HttpException('Please provide a valid search query.', HttpStatus.BAD_REQUEST);
    }

    const profesionales = await this.profesionalService.searchProfesionales(query);

    // Filtrar las profesiones asignadas al profesional en cuestión
    const resultados = await Promise.all(
      profesionales.map(async (profesional) => {
        if (profesional.tipoProfesion && profesional.tipoProfesion.length > 0) {
          const profesionesAsignadas = profesional.tipoProfesion.map((profesion) => {
            return {
              id_profesion: profesion.id_profesion,
              nombre_profesion: profesion.nombre_profesion,
            };
          });

          // Devuelve el objeto con las profesiones asignadas al profesional
          return {
            id: profesional.profesionalId,
            nombre: profesional.nombre,
            apellido: profesional.apellido,
            correo: profesional.correo,
            nroTelefono: profesional.nroTelefono,
            tipoProfesion: profesionesAsignadas,
          };
        } else {
          // Devuelve el objeto sin la profesión si no está definida
          return {
            id: profesional.profesionalId,
            nombre: profesional.nombre,
            apellido: profesional.apellido,
            correo: profesional.correo,
            nroTelefono: profesional.nroTelefono,
            tipoProfesion: [], // O cualquier otro valor predeterminado apropiado
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

      // if (profesional && profesion) {
      //   if (!profesional.tipoProfesion) {
      //     profesional.tipoProfesion = [];
      //   }
      //   profesional.tipoProfesion.push(profesion[0]);
      //   await this.profesionalService.update(profesional);
      //   return { message: 'Profesión asignada con éxito' };
      // } else {
      //   return { message: 'No se pudo encontrar el profesional o la profesión' };
      // }

      if (profesional && profesion) {
        await this.profesionalService.updateProfesional(profesionalId, profesion); // Utiliza la nueva función de actualización
        return { message: 'Profesión asignada con éxito' };
      } else {
        return { message: 'No se pudo encontrar el profesional o la profesión' };
      }

      // if (profesional && profesion) {
      //   // Asegúrate de que profesional.tipoProfesion sea una matriz o una lista
      //   profesional.tipoProfesion.push(profesion[0]);
      //   await this.profesionalService.update(profesional);
      //   // return { message: 'Profesión asignada con éxito' };
      //   return console.log(profesion, profesional);

      // } else {
      //   return { message: 'No se pudo encontrar el profesional o la profesión' };
      //   return console.log(profesion, profesional);
      // }

    } catch (error) {
      console.log(error.message);
      throw new Error('No se pudo asignar la profesión');
    }
  }

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




  // @Get()
  // getProfesionals(): Promise<Profesional[]> {
  //   return this.profesionalService.getProfesionals()
  // }

  // @Get(':id')
  // getProfesional(@Param('id', ParseIntPipe) id: number) {
  //   return this.profesionalService.getProfesional(id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProfesionalDto: UpdateProfesionalDto) {
  //   return this.profesionalService.updateProfesional(+id, updateProfesionalDto);
  // }

  @Delete(':id')
  deleteProfesional(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalService.deleteProfesional(id)
  }

}

