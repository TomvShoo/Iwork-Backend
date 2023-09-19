import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartaTrabajoService } from './carta-trabajo.service';
import { CreateCartaTrabajoDto } from './dto/create-carta-trabajo.dto';
import { UpdateCartaTrabajoDto } from './dto/update-carta-trabajo.dto';

@Controller('carta-trabajo')
export class CartaTrabajoController {
  constructor(private readonly cartaTrabajoService: CartaTrabajoService) {}

  @Post()
  create(@Body() createCartaTrabajoDto: CreateCartaTrabajoDto) {
    return this.cartaTrabajoService.create(createCartaTrabajoDto);
  }

  @Get()
  findAll() {
    return this.cartaTrabajoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartaTrabajoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartaTrabajoDto: UpdateCartaTrabajoDto) {
    return this.cartaTrabajoService.update(+id, updateCartaTrabajoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartaTrabajoService.remove(+id);
  }
}
