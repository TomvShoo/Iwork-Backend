import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfesionDto } from './dto/create-profesion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profesion } from './entities/profesion.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class ProfesionService {

  constructor(@InjectRepository(Profesion) private profesionRepository: Repository<Profesion>,) { }

  async createProfesion(profesion: CreateProfesionDto) {
    const newProfesion = this.profesionRepository.create(profesion);
    return this.profesionRepository.save(newProfesion);
  }

  findAllProfesion() {
    return this.profesionRepository.find({
      relations: ['profesionales', 'profesionales.resena']
    })
  }

  async find(options?: FindManyOptions<Profesion>): Promise<Profesion[]> {
    return this.profesionRepository.find(options);
  }

  async findById(id_profesion: number): Promise<Profesion[]> {
    return this.profesionRepository.find({ where: { id_profesion } });
  }

  async deleteProfesion(id_profesion: number) {
    const result = await this.profesionRepository.delete({ id_profesion });

    if(result.affected === 0) {
        return new HttpException('profesion no encontrada', HttpStatus.NOT_FOUND)
    }

    return result
}

  // findOne(id: number) {
  //   return `This action returns a #${id} profesion`;
  // }

  // update(id: number, updateProfesionDto: UpdateProfesionDto) {
  //   return `This action updates a #${id} profesion`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} profesion`;
  // }
}
