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

  async getProfesional(profesionalId: number): Promise<Profesional | null> {
    const profesionalFound = await this.profesionalRepository.findOne({
      where: {
        profesionalId
      }
    });

    return profesionalFound || null;
  }

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

  async findProfesionalWithProfesion(profesionalId: number): Promise<Profesional> {
    return this.profesionalRepository
      .createQueryBuilder('profesional')
      .leftJoinAndSelect('profesional.tipoProfesion', 'profesion') // Carga la relación con la profesión
      .where('profesional.profesionalId = :id', { id: profesionalId })
      .getOne();
  }

  findByEmailwithPassword(correo: string) {
    return this.profesionalRepository.findOne({
      where: { correo },
      select: ['profesionalId', 'nombre', 'apellido', 'correo', 'contrasena',]
    })
  }

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

  async deleteProfesional(profesionalId: number) {
    const result = await this.profesionalRepository.delete({ profesionalId });

    if (result.affected === 0) {
      return new HttpException('Usuario nop encontrado', HttpStatus.NOT_FOUND)
    }

    return result
  }


  async searchProfesionales(query: string) {
    return this.profesionalRepository
      .createQueryBuilder('profesional')
      .leftJoinAndSelect('profesional.tipoProfesion', 'profesion')
      .where(
        'profesional.nombre LIKE :query OR profesional.apellido LIKE :query OR profesion.nombre_profesion LIKE :query',
        { query: `%${query}%` },
      )
      .getMany();
  }

  async findProfesionesByProfesionalId(profesionalId: number): Promise<Profesion[]> {
    const profesional = await this.profesionalRepository.findOne({
      where: { profesionalId },
      relations: ["tipoProfesion"]
    });
    if (profesional) {
      return profesional.tipoProfesion;
    } else {
      return [];
    }
  }



  async update(profesional: Profesional): Promise<Profesional> {
    return this.profesionalRepository.save(profesional);
  }


  async updateProfesional(profesionalId: number, profesiones: Profesion[]): Promise<Profesional | undefined> {
    try {
      const profesional = await this.profesionalRepository.findOne({ where: { profesionalId }, relations: ["tipoProfesion"] });
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





  async findById(profesionalId: number): Promise<Profesional> {
    return this.profesionalRepository.findOne({ where: { profesionalId } });
  }

}
