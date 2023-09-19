import { Injectable } from '@nestjs/common';
import { CreateCartaTrabajoDto } from './dto/create-carta-trabajo.dto';
import { UpdateCartaTrabajoDto } from './dto/update-carta-trabajo.dto';

@Injectable()
export class CartaTrabajoService {
  create(createCartaTrabajoDto: CreateCartaTrabajoDto) {
    return 'This action adds a new cartaTrabajo';
  }

  findAll() {
    return `This action returns all cartaTrabajo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartaTrabajo`;
  }

  update(id: number, updateCartaTrabajoDto: UpdateCartaTrabajoDto) {
    return `This action updates a #${id} cartaTrabajo`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartaTrabajo`;
  }
}
