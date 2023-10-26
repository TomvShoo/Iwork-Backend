import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { UpdateProfesionalDto } from './dto/update-profesional.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Portafolio } from 'src/portafolio/entities/portafolio.entity';
import { Repository } from 'typeorm';
import { Profesional } from './entities/profesional.entity';
import { Profesion } from 'src/profesion/entities/profesion.entity';


@Injectable()
export class ProfesionalService {

  constructor(
    @InjectRepository(Profesional) private profesionalRepository: Repository<Profesional>

  ) { }

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

  async findOneByEmail(correo: string) {
    try {
      return await this.profesionalRepository
        .createQueryBuilder('profesional')
        .leftJoinAndSelect('profesional.tipoProfesion', 'profesion') // Carga la relación con la profesión
        .where('profesional.correo = :correo', { correo })
        .getOne();
    } catch (error) {
      console.log(error.message);
    }
  }

  async getProfesional(profesionalId: number) {
    
      return await this.profesionalRepository
        .createQueryBuilder('profesional')
        .leftJoinAndSelect('profesional.tipoProfesion', 'profesion') // Asegúrate de reemplazar 'profesiones' con el nombre real de tu relación
        .where('profesional.profesionalId = :profesionalId', { profesionalId })
        .getOne();
    
  }

  async searchProfesionales(query: string) {
    return await this.profesionalRepository
      .createQueryBuilder('profesional')
      .leftJoinAndSelect('profesional.tipoProfesion', 'profesion')
      .where(
        'profesional.nombre LIKE :query OR profesional.apellido LIKE :query OR profesion.nombre_profesion LIKE :query',
        { query: `%${query}%` },
      )
      .getMany();
  }

  findByEmailwithPassword(correo: string) {
    return this.profesionalRepository.findOne({
      where: { correo },
      select: ['id', 'nombre', 'apellido', 'correo', 'contrasena',]
    })
  }

  async update(profesional: Profesional): Promise<Profesional> {
    return this.profesionalRepository.save(profesional);
  }


  async updateProfesional(id: number, profesiones: Profesion[]): Promise<Profesional | undefined> {
    try {
      const profesional = await this.profesionalRepository.findOne({ where: { id }, relations: ["tipoProfesion"] });
      if (!profesional) {
        throw new Error('Profesional no encontrado');
      }
      if (profesional.tipoProfesion) {
        profesional.tipoProfesion = [...profesional.tipoProfesion, ...profesiones];
      } else {
        profesional.tipoProfesion = profesiones;
      }
      return this.profesionalRepository.save(profesional);
    } catch (error) {
      console.log(error.message);
      throw new Error('No se pudo actualizar el profesional');
    }
  }

  async findById(id: number): Promise<Profesional> {
    return this.profesionalRepository.findOne({ where: { id } });
  }

  async deleteProfesional(id: number) {
    const result = await this.profesionalRepository.delete({ id });

    if (result.affected === 0) {
      return new HttpException('Usuario nop encontrado', HttpStatus.NOT_FOUND)
    }

    return result
  }

  // async getProfesionalById(profesionalId: number): Promise<Profesional> {
  //   try {
  //     return await this.profesionalRepository
  //       .createQueryBuilder('profesional')
  //       .leftJoinAndSelect('profesional.tipoProfesion', 'profesion') // Asegúrate de reemplazar 'profesiones' con el nombre real de tu relación
  //       .where('profesional.profesionalId = :profesionalId', { profesionalId })
  //       .getOne();      
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  // async findOneByEmail(correo: string) {
  //   try {
  //     return await this.profesionalRepository.findOne({
  //       where: {
  //         correo: correo
  //       }
  //     })

  //   } catch (error) {
  //     console.log(error.message);

  //   }
  // }

  // async findProfesionalWithProfesion(profesionalId: number): Promise<Profesional> {
  //   return this.profesionalRepository
  //     .createQueryBuilder('profesional')
  //     .leftJoinAndSelect('profesional.tipoProfesion', 'profesion') // Carga la relación con la profesión
  //     .where('profesional.profesionalId = :id', { id: profesionalId })
  //     .getOne();
  // }

  // async updateProfesional(profesionalId: number, profesional: UpdateProfesionalDto) {
  //   const profesionalFound = await this.profesionalRepository.findOne({
  //     where: {
  //       profesionalId
  //     }
  //   })

  //   if (!profesionalFound) {
  //     return new HttpException('Usuario no econtrado :C', HttpStatus.NOT_FOUND);
  //   }

  //   const updateprofesional = Object.assign(profesionalFound, profesional);
  //   return this.profesionalRepository.save(updateprofesional);
  // }

  // async findProfesionesByProfesionalId(profesionalId: number): Promise<Profesion[]> {
  //   const profesional = await this.profesionalRepository.findOne({
  //     where: { profesionalId },
  //     relations: ["tipoProfesion"]
  //   });
  //   if (profesional) {
  //     return profesional.tipoProfesion;
  //   } else {
  //     return [];
  //   }
  // }

}
