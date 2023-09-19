import { Injectable } from '@nestjs/common';
import { CreateProfesionDto } from './dto/create-profesion.dto';
import { UpdateProfesionDto } from './dto/update-profesion.dto';

@Injectable()
export class ProfesionService {
  create(createProfesionDto: CreateProfesionDto) {
    return 'This action adds a new profesion';
  }

  findAll() {
    return `This action returns all profesion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profesion`;
  }

  update(id: number, updateProfesionDto: UpdateProfesionDto) {
    return `This action updates a #${id} profesion`;
  }

  remove(id: number) {
    return `This action removes a #${id} profesion`;
  }
}
