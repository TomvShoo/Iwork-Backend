import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto';
import { Profesional } from 'src/profesional/entities/profesional.entity';
import { Reseña } from 'src/reseña/entities/reseña.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Profesional) private readonly profesionalRepository: Repository<Profesional>,
        @InjectRepository(Reseña) private resenaRepository: Repository<Reseña>,) { }

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
            return await this.userRepository.findOne({
                where: {
                    correo: correo,
                }
            })
        } catch (error) {
            console.log(error.message);

        }
    }

    findByEmailwithPassword(correo: string) {
        return this.userRepository.findOne({
            where: { correo },
            select: ['id', 'nombre', 'apellido', 'correo', 'contrasena',]
        })
    }

    getUsers() {
        return this.userRepository.find()
    }

    async getUser(id: number) {
        const userFound = await this.userRepository.findOne({
            where: {
                id,
            },
        });

        if (!userFound) {
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        return userFound;
    }

    async deleteUser(id: number) {
        const user = await this.userRepository.find({
            where: {id},
            relations: ['resena']
        });
        if (!user) {
            throw new NotFoundException(`cliente con el id ${id} no encontrado`)
        }

        const resenas = await this.resenaRepository.find({ where: {userid: id} });
        await Promise.all(resenas.map(async (resena) => {
            await this.resenaRepository.delete(resena.resenaId);
        }));
        
        await this.userRepository.remove(user);

        return { message: `cliente con el id: ${id} fue eliminado con todo lo relacionado a el.` }
    }

    async updateUser(id: number, user: UpdateUserDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        })

        if (!userFound) {
            return new HttpException('Usuario no econtrado :C', HttpStatus.NOT_FOUND);
        }

        const updateUser = Object.assign(userFound, user);
        return this.userRepository.save(updateUser);
    }

    async searchUser(query: string) {
        return await this.userRepository
            .createQueryBuilder('cliente')
            .where(
                'cliente.nombre LIKE :query OR cliente.apellido LIKE :query',
                { query: `%${query}%` },
            )
            .getMany();
    }
}
