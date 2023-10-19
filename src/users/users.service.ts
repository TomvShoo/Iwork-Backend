import { Injectable, HttpException , HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto';
import { Profesional } from 'src/profesional/entities/profesional.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
                @InjectRepository(Profesional) private readonly profesionalRepository: Repository<Profesional>) {}
 
    async createUser(user: CreateUserDto) {
        const userfound = await this.userRepository.findOne({
            where: {
                correo: user.correo
            }
        })

        if (userfound) {
            return new HttpException('Usuario ya existe', HttpStatus.CONFLICT)
        }

        const newUser = this.userRepository.create(user)
        return this.userRepository.save(newUser)
    }

    async findOneByEmail(correo: string) {
        try {
            return await this.userRepository.findOne({ where: {
                correo: correo,
            } })
            
        } catch (error) {
            console.log(error.message);
            
        }
    }

    findByEmailwithPassword(correo: string) {
        return this.userRepository.findOne({
            where: { correo },
            select: ['id', 'nombre','apellido','correo','contrasena',]
        })
    }

    getUsers(){
        return this.userRepository.find()
    }

    async getUser(id: number){
        const userFound = await this.userRepository.findOne({
            where: {
                id,
            },
        });

        if(!userFound) {
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        return userFound;
    }

    async deleteUser(id: number) {
        const result = await this.userRepository.delete({ id });
    
        if(result.affected === 0) {
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        return result
    }

    async updateUser(id: number, user:UpdateUserDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        })

        if(!userFound) {
            return new HttpException('Usuario no econtrado :C', HttpStatus.NOT_FOUND);
        }

        const updateUser = Object.assign(userFound, user);
        return this.userRepository.save(updateUser);
    }

    // async searchProfessionals(query: string) {
    // return this.profesionalRepository.createQueryBuilder("profesional")
    //     .where("profesional.nombre LIKE :query", { query: `%${query}%` })
    //     .orWhere("profesional.profesion LIKE :query", { query: `%${query}%` })
    //     .getMany();
    // }


    async searchProfessionals(query: string) {
    return this.profesionalRepository
        .createQueryBuilder('profesional')
        .where(
        'profesional.nombre LIKE :query OR profesional.apellido LIKE :query OR profesional.profesion LIKE :query',
        { query: `%${query}%` },
        )
        .getMany();
    }

    // async all(): Promise<Profesional[]> {
    //     return this.profesionalRepository.find();
    // }

    // async queryBuilder(alias: string) {
    //     return this.profesionalRepository.createQueryBuilder(alias);
    // }


}
