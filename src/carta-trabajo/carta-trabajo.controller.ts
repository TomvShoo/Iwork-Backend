import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartaTrabajoService } from './carta-trabajo.service';
import { CreateCartaTrabajoDto } from './dto/create-carta-trabajo.dto';
import { UpdateCartaTrabajoDto } from './dto/update-carta-trabajo.dto';

@Controller('cartaTrabajo')
export class CartaTrabajoController {
  
  constructor(private cartaTrabajoService: CartaTrabajoService) {}


  @Post()
  createCard(@Body() carta: CreateCartaTrabajoDto) {
    return this.cartaTrabajoService.createCarta(carta);
  }

  @Get()
  findAll() {
    return this.cartaTrabajoService.findAllCarta();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartaTrabajoService.findOneCarta(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartaTrabajoDto: UpdateCartaTrabajoDto) {
  //   return this.cartaTrabajoService.updateCarta(+id, updateCartaTrabajoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cartaTrabajoService.removeCarta(+id);
  // }
}
