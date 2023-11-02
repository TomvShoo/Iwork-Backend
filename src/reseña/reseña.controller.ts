import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { CreateReseñaDto } from './dto/create-reseña.dto';
import { UpdateReseñaDto } from './dto/update-reseña.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { throws } from 'assert';

@Controller('resena')
export class ReseñaController {
  constructor(private readonly reseñaService: ReseñaService,
    private readonly jwtService: JwtService,) { }

  @Get()
  async findAllResenas() {
    try {
      const resenas = await this.reseñaService.findAllResenasWithProfesional();
      return resenas;
    } catch (error) {
      console.error('Error al obtener todas las reseñas', error);
      throw new Error('No se pudieron obtener las reseñas con el profesional asociado')
    }
  }
  @Post('subirResena')
  async uploadResena(@Body() resenaData: CreateReseñaDto, @Req() req: Request) {
    try {
      const { authorization } = req.headers;
      const token = authorization.split(' ')[1];

      const decodedToken = this.jwtService.decode(token);

      if (typeof decodedToken == 'string') {
        return {
          success: false,
          data: 'error en el token'
        };
      }

      const userId = decodedToken.id
      const profesionalId = resenaData.profesionalId;

      const resena = {
        calificacion: resenaData.calificacion,
        resena: resenaData.resena,
        tipo: resenaData.tipo,
        profesionalId: profesionalId,
      }

      const result = await this.reseñaService.createResena(resena, userId, profesionalId);
      return result
    } catch (error) {
      console.log(error.message);
      throw new Error('No se pudo guardar la reseña')
    }
  }



  @Get('profesional/:id')
  async findResenaByProfesionalId(@Param('id') duenoProfesionalID: number) {
    try {
      const resenas = await this.reseñaService.findResenasByProfesionalId(duenoProfesionalID);
      return resenas;
    } catch (error) {
      console.error('Error fetching reseñas by profesional ID:', error);
      throw new Error('No se pudieron obtener las reseñas del profesional');
    }
  }

  @Get('cliente/:id')
  async findResenaByUserId(@Param('id') usuarioId: number) {
    try {
      const resenas = await this.reseñaService.findResenasByUserId(usuarioId);
      return resenas;
    } catch (error) {
      console.error('Error al encontrar reseñas del user id', error);
      throw new Error('No se pudieron obtener las reseñas del usuario');
    }
  }

  @Get()
  findAll() {
    return this.reseñaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reseñaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReseñaDto: UpdateReseñaDto) {
    return this.reseñaService.update(+id, updateReseñaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reseñaService.remove(+id);
  }
}
