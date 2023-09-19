import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePortafolioDto } from './dto/create-portafolio.dto';
import { UpdatePortafolioDto } from './dto/update-portafolio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Portafolio } from './entities/portafolio.entity';
import { Profesional } from 'src/profesional/entities/profesional.entity';
import { Repository } from 'typeorm';
import { CreateProfesionalDto } from 'src/profesional/dto/create-profesional.dto';

@Injectable()
export class PortafolioService {
  constructor(
    @InjectRepository(Portafolio) private portafolioRepository: Repository<Portafolio>,
    @InjectRepository(Profesional) private profesionalRepository: Repository<Profesional> ) {}
  
  
  // createPortafolio(portafolio: CreatePortafolioDto) {
  //   const NewPortafolio = this.portafolioRepository.create(portafolio)
  //   return this.portafolioRepository.save(NewPortafolio)
  // }

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

  async createPortafolio(id: number, Portafolio: CreatePortafolioDto) {
  const profesionalFound = await this.profesionalRepository.findOne({
     where: {
       id
    }
   })

    if (!profesionalFound) {
     return new HttpException('Usuario no econtrado :C', HttpStatus.NOT_FOUND);
    }
    
    const nuevoPortfolio = this.portafolioRepository.create(Portafolio)

    const savePortfolio = await this.portafolioRepository.save(nuevoPortfolio);

    profesionalFound.portafolio = savePortfolio

    return this.profesionalRepository.save(profesionalFound)
  }

}
