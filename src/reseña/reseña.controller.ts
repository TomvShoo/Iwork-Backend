import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { CreateReseñaDto } from './dto/create-reseña.dto';
import { UpdateReseñaDto } from './dto/update-reseña.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('resena')
export class ReseñaController {
  constructor(private readonly reseñaService: ReseñaService,
              private readonly jwtService: JwtService,) {}

  // @Post()
  // create(@Body() createReseñaDto: CreateReseñaDto) {
  //   return this.reseñaService.createResena(createReseñaDto);
  // }

  @Post('subirResena')
  async uploadResena(@Body() resenaData: CreateReseñaDto, @Req() req: Request) {
    try {
      const {authorization} = req.headers;
      const token = authorization.split(' ') [1];

      const decodedToken = this.jwtService.decode(token);

      if (typeof decodedToken == 'string') {
        return {
          success: false,
          data: 'error en el token'
        };    
      }

      const userId = decodedToken.id

      const resena = {
        calificacion: resenaData.calificacion,
        resena: resenaData.resena,
      }

      const result = await this.reseñaService.createResena(resena, userId);
      return result
    } catch (error) {
      console.log(error.message);
      throw new Error('No se pudo guardar la reseña')      
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
