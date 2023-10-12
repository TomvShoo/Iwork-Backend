import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Patch, UploadedFile, UseInterceptors, Query, NotFoundException, Req } from '@nestjs/common';
import { PortafolioService } from './portafolio.service';
import { CreatePortafolioDto } from './dto/create-portafolio.dto';
import { UpdatePortafolioDto } from './dto/update-portafolio.dto';
import { Portafolio } from './entities/portafolio.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProfesionalService } from 'src/profesional/profesional.service';
import { Profesional } from 'src/profesional/entities/profesional.entity';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('portafolio')
export class PortafolioController {
  constructor(private readonly portafolioService: PortafolioService,
              private readonly profesionalService: ProfesionalService,
              private readonly jwtService: JwtService,) {}

  // @Get()
  // getPortafolios(): Promise<Portafolio[]> {
  //   return this.portafolioService.getPortafolios();
  // }

  @Get(':id')
  async getPortafolio(@Param('id', ParseIntPipe) id: number) {
    const portafolio = await this.portafolioService.getPortafolio(id);
    if (!portafolio) {
      throw new NotFoundException(`Portafolio con el ID ${id} no encontrado`);
    }
    return portafolio;
  }

  @Post('upload')
  async uploadFile(@Body() portafolioData: CreatePortafolioDto, @Req() req: Request) {

    try {
      const {authorization} = req.headers
      const token = authorization.split(' ') [1];

      const decodedToken = this.jwtService.decode(token);

      if (typeof decodedToken == 'string') {
        return {
          success: false,
          data: 'error en el token'
        };
      }
     

      const profesionalId = decodedToken.id

      const portafolio = {
        descripcion: portafolioData.descripcion,
        certificaciones: portafolioData.certificaciones,
        imagen: portafolioData.imagen,
      };

      const result = await this.portafolioService.createPortafolio(portafolio, profesionalId)
      return result;
    } catch (error) {
      console.log(error.message)
      throw new Error('No se pudo guardar la imagen')
      
    }

  }

  // @Post(':profesionalId/upload')
  //  uploadPortfolio(
  //   @Param('profesionalId') profesionalId: number,
  //   @Body() CreatePortafolioDto: CreatePortafolioDto,
  // ) {
    
  //   CreatePortafolioDto.profesionalId = profesionalId;

  //   const portafolio = this.portafolioService.createPortafolio(CreatePortafolioDto);
  //   return portafolio;
  // };


  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Query('profesionalId') profesionalId: number,
  // ) {
  //   const portafolio = new Portafolio();
  //   portafolio.imagen = file.buffer;

  //   // obtener profesional
  //   const profesional = await this.profesionalService.getProfesional(profesionalId);

  //   if (!profesional) {
  //     throw new NotFoundException(`Profesional con el ID ${profesionalId} no encontrado`);
  //   }

  //   portafolio.profesional = profesional;


  //   // guardar portafolio
  //   await this.portafolioService.createPortafolio(portafolio)
  // }

}
