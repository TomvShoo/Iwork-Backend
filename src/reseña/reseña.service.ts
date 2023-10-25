import { Injectable } from '@nestjs/common';
import { CreateReseñaDto } from './dto/create-reseña.dto';
import { UpdateReseñaDto } from './dto/update-reseña.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reseña } from './entities/reseña.entity';
import { Repository } from 'typeorm';
import { Profesional } from 'src/profesional/entities/profesional.entity';

@Injectable()
export class ReseñaService {
  constructor(
    @InjectRepository(Reseña) private readonly resenaRepository: Repository<Reseña>,
    @InjectRepository(Profesional) private readonly profesionalRepository: Repository<Profesional>
  ) { }

  async createResena(reseña: CreateReseñaDto, userid: number, profesionalId: number) {
    try {
      const newResena = new Reseña();
      newResena.calificacion = reseña.calificacion;
      newResena.resena = reseña.resena;
      newResena.userid = userid;

      const profesional = await this.profesionalRepository.findOne({ where: { profesionalId: profesionalId } });


      if (!profesional) {
        throw new Error('Profesional no encontrado');
      }

      newResena.dueno = profesional;

      const data = await this.resenaRepository.save(newResena);
      return {
        succes: true,
        data: data
      }
    } catch (error) {
      return {
        succes: false,
        data: error.message
      }
    }
  }

  async findResenasByProfesionalId(profesionalId: number) {
    try {
      const resenas = await this.resenaRepository.find({
        where: {
          dueno: { profesionalId }
        }
      });
  
      return resenas;
    } catch (error) {
      throw new Error('Error al buscar las reseñas por ID de profesional');
    }
  }

  findAll() {
    return `This action returns all reseña`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reseña`;
  }

  update(id: number, updateReseñaDto: UpdateReseñaDto) {
    return `This action updates a #${id} reseña`;
  }

  remove(id: number) {
    return `This action removes a #${id} reseña`;
  }
}
