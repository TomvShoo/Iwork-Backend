import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfesionDto } from './dto/create-profesion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profesion } from './entities/profesion.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Profesional } from 'src/profesional/entities/profesional.entity';
import { ProfesionalService } from 'src/profesional/profesional.service';

@Injectable()
export class ProfesionService {

  constructor(@InjectRepository(Profesion) private profesionRepository: Repository<Profesion>,
              @InjectRepository(Profesional) private readonly profesionalRepository: Repository<Profesional>,
              private readonly profesionalService: ProfesionalService) { }

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
    return this.profesionRepository.find({ where: { id_profesion }, relations: ['profesionales', 'profesionales.resena'] });
  }

  async deleteProfesion(id_profesion: number) {
    const profesion = await this.profesionRepository.findOne({ where: { id_profesion }, relations: ['profesionales'] });
    if (!profesion) {
      return new HttpException('Profesion no encontrada', HttpStatus.NOT_FOUND);
    }

    for (const profesional of profesion.profesionales) {
      await this.profesionalService.eliminarProfesion(profesional.id, id_profesion)
    }

    const result = await this.profesionRepository.delete({ id_profesion });
    if (result.affected === 0) {
      return new HttpException('profesion no encontrada', HttpStatus.NOT_FOUND)
    }

    const remainingProfesion = await this.profesionRepository.findOne({ where: {id_profesion}, relations: ['profesionales'] });
    if (remainingProfesion && remainingProfesion.profesionales.length === 0) {
      await this.profesionRepository.remove(remainingProfesion);
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
