import { Injectable } from '@nestjs/common';
import { CreateReseñaDto } from './dto/create-reseña.dto';
import { UpdateReseñaDto } from './dto/update-reseña.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reseña, TipoResena } from './entities/reseña.entity';
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
      newResena.tipo = reseña.tipo;

      let profesional;

      // const profesional = ;
      if (newResena.tipo === TipoResena.Comentario) {
        profesional = await this.profesionalRepository.findOne({ where: { id: id } })
      } else if (newResena.tipo === TipoResena.Reclamo) {
        profesional = await this.profesionalRepository.findOne({ where: { id: id } })
      }

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

  async findAllResenasWithProfesional() {
    try {
      const resenas = await this.resenaRepository.find({
        relations: ['dueno']
      });

      const resenasWithProfesionales = await Promise.all(
        resenas.map(async (resena) => {
          const profesional = await this.profesionalRepository.findOne({ where: {id: resena.dueno.id} });
          const cliente = await this.userRepository.findOne({ where: {id: resena.userid} });
          return {
            resenaId: resena.resenaId,
            calificacion: resena.calificacion,
            resena: resena.resena,
            tipo: resena.tipo,
            userid: resena.userid,
            CreatedAt: resena.CreatedAt,
            escritor: {
              id: cliente.id,
              nombre: cliente.nombre,
              apellido: cliente.apellido,
              correo: cliente.correo
            },
            dueno: {
              id: profesional.id,
              nombre: profesional.nombre,
              apellido: profesional.apellido,
              correo: profesional.correo
            }
          };
        })
      );

      return resenasWithProfesionales;
    } catch (error) {
      throw new Error('Error al obtener todas las reseñas con el profesional asociado');
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

  async findResenasByUserId(userId: number) {
    try {
      const resenas = await this.resenaRepository.find({
        where: {
          userid: userId
        },
        relations: ['dueno'] 
      });

      const resenasWithProfesionales = await Promise.all(
        resenas.map(async (resena) => {
          const profesional = resena.dueno;
          return {
            resenaId: resena.resenaId,
            calificacion: resena.calificacion,
            resena: resena.resena,
            tipo: resena.tipo,
            userid: resena.userid,
            CreatedAt: resena.CreatedAt,
            dueno: {
              id: profesional.id,
              nombre: profesional.nombre,
              apellido: profesional.apellido // Agrega otros campos según tus necesidades
            }
          };
        })
      );

      return resenasWithProfesionales;
    } catch (error) {
      throw new Error('Error al buscar las reseñas por ID de usuario: ' + error.message);
    }
  }

  // async findResenasByUserId(id: number) {
  //   try {
  //     const resenas = await this.resenaRepository.find({
  //       where: {
  //         escritor: { id }
  //       },
  //       relations: ['dueno']
  //     });

  //     const resenasWithDuenoName = await Promise.all(
  //       resenas.map(async (resena) => {
  //         const dueno = await this.profesionalRepository.findOne({ where: { id: resena.dueno.id } });
  //         return { ...resena, nombreDueno: dueno ? `${dueno.nombre} ${dueno.apellido}` : 'profesional desconocido' };
  //       })
  //     );
  //     return resenasWithDuenoName;
  //   } catch (error) {
  //     throw new Error('error al buscar las reseñas por id de usuario');
  //   }
  // }

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
