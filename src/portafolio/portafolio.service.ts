import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePortafolioDto } from './dto/create-portafolio.dto';
import { UpdatePortafolioDto } from './dto/update-portafolio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Portafolio } from './entities/portafolio.entity';
import { Profesional } from '../profesional/entities/profesional.entity';
import { Repository } from 'typeorm';
import { CreateProfesionalDto } from '../profesional/dto/create-profesional.dto';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PortafolioService {
  constructor(
    @InjectRepository(Portafolio) private portafolioRepository: Repository<Portafolio>,
    @InjectRepository(Profesional) private profesionalRepository: Repository<Profesional>,
                                  private readonly jwtService: JwtService, ) {}


  async getPortafolio(id_portafolio: number) {
    const portafolioFound = await this.portafolioRepository.findOne({
      where: {
        id_portafolio,
      }
    });

    if(!portafolioFound) {
      return new HttpException('Portafolio no encontrado', HttpStatus.NOT_FOUND)
    }

    return portafolioFound;
  }

  async getPortafoliosByProfesionalId(profesionalId: number) {
    const portafolios = await this.portafolioRepository.find({
      where: {
        profesionalId,
      },
    });

    if (!portafolios || portafolios.length === 0) {
      throw new HttpException('No se encontró ningún portafolio para este profesional', HttpStatus.NOT_FOUND);
    }

    return portafolios;
  }


  async createPortafolio(portafolio: CreatePortafolioDto, profesionalId: number) {

    const imagen = portafolio.imagen;

    try {
      const newPortafolio = new Portafolio();
      newPortafolio.descripcion = portafolio.descripcion;
      newPortafolio.certificaciones = portafolio.certificaciones;
      newPortafolio.imagen = imagen;
      newPortafolio.profesionalId = profesionalId
      
      const data = await this.portafolioRepository.save(newPortafolio);
      return {
        success:true,
        data:data
      }
    } catch (error) {
      return {
        success:false,
        data:error.message
      }      
    }
  }
}

  // async createPortafolio(id: number, Portafolio: CreatePortafolioDto) {
  // const profesionalFound = await this.profesionalRepository.findOne({
  //    where: {
  //      id
  //   }
  //  })

  //   if (!profesionalFound) {
  //    return new HttpException('Usuario no econtrado :C', HttpStatus.NOT_FOUND);
  //   }
    
  //   const nuevoPortfolio = this.portafolioRepository.create(Portafolio)

  //   const savePortfolio = await this.portafolioRepository.save(nuevoPortfolio);

  //   profesionalFound.portafolio = savePortfolio

  //   return this.profesionalRepository.save(profesionalFound)
  // }


  // const dataBuffer = Buffer.from(imagen, 'base64');
      // const processedImageBuffer = await sharp(dataBuffer).toBuffer();
      // fs.writeFileSync(nombreArchivo, processedImageBuffer);