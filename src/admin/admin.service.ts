import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,) { }

  async create(admin: CreateAdminDto) {
    const newAdmin = this.adminRepository.create(admin);
    return this.adminRepository.save(newAdmin);
  }

  findAll() {
    return `This action returns all admin`;
  }

  async findOne(id: number) {
    return await this.adminRepository.findOne({ where: { id } });
  }

  async findOneByEmail(correo: string) {
    try {
      return await this.adminRepository.findOne({
        where: {
          correo: correo,
        }
      })
    } catch (error) {
      console.log(error.message);

    }
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
