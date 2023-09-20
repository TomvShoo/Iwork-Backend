import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCartaTrabajoDto } from './dto/create-carta-trabajo.dto';
import { UpdateCartaTrabajoDto } from './dto/update-carta-trabajo.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CartaTrabajo } from './entities/carta-trabajo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartaTrabajoService {

  constructor(@InjectRepository(CartaTrabajo) private cartaRepository: Repository<CartaTrabajo>,
  private userService: UsersService) {}

  async createCarta(carta: CreateCartaTrabajoDto) {
    const userFound = await this.userService.getUser(carta.id_profesional)
    
    if(!userFound) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
    }

    const newCarta = this.cartaRepository.create(carta);
    return this.cartaRepository.save(newCarta);
  }

  findAllCarta() {
    return this.cartaRepository.find({
      relations: ['author']
    });
  }

  // findOneCarta(id: number) {
  //   return `This action returns a #${id} cartaTrabajo`;
  // }

}
