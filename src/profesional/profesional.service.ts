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

  async getProfesional(profesionalId: number): Promise<Profesional | null> {
    const profesionalFound = await this.profesionalRepository.findOne({
      where: {
        profesionalId
      }
    });
  
    return profesionalFound || null; 
  }

  async findOneByEmail(correo: string) {
    try {
        return await this.profesionalRepository.findOne({ where: {
            correo: correo
        } })
        
    } catch (error) {
        console.log(error.message);
        
    }
}

  async updateProfesional(profesionalId: number, profesional: UpdateProfesionalDto) {
    const profesionalFound = await this.profesionalRepository.findOne({
      where: {
        profesionalId
      }
    })

    if(!profesionalFound) {
      return new HttpException('Usuario no econtrado :C', HttpStatus.NOT_FOUND); 
    }

    const updateprofesional = Object.assign(profesionalFound, profesional);
    return this.profesionalRepository.save(updateprofesional);
  }

  async deleteProfesional(profesionalId: number) {
    const result = await this.profesionalRepository.delete({ profesionalId });

    if(result.affected === 0) {
      return new HttpException('Usuario nop encontrado', HttpStatus.NOT_FOUND)
    }

    return result    
  }

}
