import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { UpdateProfesionalDto } from './dto/update-profesional.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Portafolio } from 'src/portafolio/entities/portafolio.entity';
import { Repository } from 'typeorm';
import { Profesional } from './entities/profesional.entity';

@Injectable()
export class ProfesionalService {

  constructor(
    @InjectRepository(Profesional) private profesionalRepository: Repository<Profesional>
    
    ) {}

  async createProfesional(profesional: CreateProfesionalDto) {
    const profesionalFound = await this.profesionalRepository.findOne({
      where: {
        correo: profesional.correo
      }
    })

    if (profesionalFound) {
      return new HttpException('Usuario ya existe', HttpStatus.CONFLICT)
    }

    const newProfesional = this.profesionalRepository.create(profesional)
    return this.profesionalRepository.save(newProfesional)
  }

  getProfesionals() {
    return this.profesionalRepository.find()
  }

  async getProfesional(id: number) {
    const profesionalFound = await this.profesionalRepository.findOne({
      where: {
        id
      }
    })

    if(!profesionalFound) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
    }

    return profesionalFound;
  }

  async updateProfesional(id: number, profesional: UpdateProfesionalDto) {
    const profesionalFound = await this.profesionalRepository.findOne({
      where: {
        id
      }
    })

    if(!profesionalFound) {
      return new HttpException('Usuario no econtrado :C', HttpStatus.NOT_FOUND); 
    }

    const updateprofesional = Object.assign(profesionalFound, profesional);
    return this.profesionalRepository.save(updateprofesional);
  }

  async deleteProfesional(id: number) {
    const result = await this.profesionalRepository.delete({ id });

    if(result.affected === 0) {
      return new HttpException('Usuario nop encontrado', HttpStatus.NOT_FOUND)
    }

    return result    
  }

}
