import { Injectable } from '@nestjs/common';
import { CreateProfesionDto } from './dto/create-profesion.dto';
import { UpdateProfesionDto } from './dto/update-profesion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profesion } from './entities/profesion.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfesionService {
  
  constructor(@InjectRepository(Profesion) private profesionRepository: Repository<Profesion>,) {}
  
  async createProfesion(profesion: CreateProfesionDto) {
    const newProfesion = this.profesionRepository.create(profesion);
    return this.profesionRepository.save(newProfesion);
  }

  findAllProfesion() {
    return this.profesionRepository.find({
      relations: ['dueno']
    })
  }

  async findById(id_profesion: number): Promise<Profesion> {
    return this.profesionRepository.findOne({ where: { id_profesion } });
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
