import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePortafolioDto } from './dto/create-portafolio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Portafolio } from './entities/portafolio.entity';
import { Profesional } from '../profesional/entities/profesional.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UpdatePortafolioDto } from './dto/update-portafolio.dto';

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

  async updatePortafolio(id_portafolio: number, portafolio: UpdatePortafolioDto) {
    const portafolioFound = await this.portafolioRepository.findOne({  where: {id_portafolio} });
    if (!portafolioFound) {
      return new HttpException('Portafolio no econtrado :C', HttpStatus.NOT_FOUND);
    }

    const updatePortafolio = Object.assign(portafolioFound, portafolio);
    return this.portafolioRepository.save(updatePortafolio);
  }
}