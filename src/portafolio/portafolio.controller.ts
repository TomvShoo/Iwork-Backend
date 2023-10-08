import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Patch, UploadedFile, UseInterceptors, Query, NotFoundException } from '@nestjs/common';
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

@Controller('portafolio')
export class PortafolioController {
  constructor(private readonly portafolioService: PortafolioService,
              private readonly profesionalService: ProfesionalService) {}

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
  async uploadFile(@Body() portafolioData: CreatePortafolioDto) {
    console.log("CONTROLADOR PORTAFOLIO")
    const imagen = portafolioData.imagen;

    const nombreArchivo = `${Date.now()}_portafolio.jpg`;

    //decodificar la imagen
    try {
      const dataBuffer = Buffer.from(imagen, 'base64');

      const processedImageBuffer = await sharp(dataBuffer).toBuffer();

      fs.writeFileSync(nombreArchivo, processedImageBuffer);

      // guardar en la base de datos
      const portafolio = await this.portafolioService.createPortafolio({
        descripcion: portafolioData.descripcion,
        certificaciones: portafolioData.certificaciones,
        imagen: portafolioData.imagen
      })
      
      console.log(portafolio);
      return portafolio;
    } catch (error) {
      console.log(error.message)
      throw new Error('No se pudo guardar la imagen')
      
    }

  }

  @Post()
  createPortafolio(@Body() portafolio: CreatePortafolioDto) {
    return this.portafolioService.createPortafolio(portafolio)
  }

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
