import { Injectable } from '@nestjs/common';
import { CreateReseñaDto } from './dto/create-reseña.dto';
import { UpdateReseñaDto } from './dto/update-reseña.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reseña } from './entities/reseña.entity';
import { Repository } from 'typeorm';
import { Profesional } from 'src/profesional/entities/profesional.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReseñaService {
  constructor(
    @InjectRepository(Reseña) private readonly resenaRepository: Repository<Reseña>,
    @InjectRepository(Profesional) private readonly profesionalRepository: Repository<Profesional>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async createResena(reseña: CreateReseñaDto, userid: number, id: number) {
    try {
      const newResena = new Reseña();
      newResena.calificacion = reseña.calificacion;
      newResena.resena = reseña.resena;
      newResena.userid = userid;

      const profesional = await this.profesionalRepository.findOne({ where: { id: id } });


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

  async findResenasByProfesionalId(id: number) {
    try {
      const resenas = await this.resenaRepository.find({
        where: {
          dueno: { id }
        },
        relations: ['escritor']
      });

      const resenasWithUsernames = await Promise.all(
        resenas.map(async (resena) => {
          const user = await this.userRepository.findOne({ where: { id: resena.userid } });
          return { ...resena, nombreUsuario: user ? `${user.nombre} ${user.apellido}` : 'Usuario desconocido' };
        })
      );

      return resenasWithUsernames;
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
