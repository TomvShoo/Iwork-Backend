import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { PortafolioService } from './portafolio.service';
import { CreatePortafolioDto } from './dto/create-portafolio.dto';
import { UpdatePortafolioDto } from './dto/update-portafolio.dto';
import { Portafolio } from './entities/portafolio.entity';

@Controller('portafolio')
export class PortafolioController {
  constructor(private portafolioService: PortafolioService) {}

  // @Get()
  // getPortafolios(): Promise<Portafolio[]> {
  //   return this.portafolioService.getPortafolios();
  // }

  @Get(':id')
  getPortafolio(@Param('id', ParseIntPipe) id: number) {
    return this.portafolioService.getPortafolio(id);
  }

  @Post('id/portafolio')
  createPortafolio(
    @Param('id', ParseIntPipe) id: number,
    @Body() Portafolio: CreatePortafolioDto) 
    {
    this.portafolioService.createPortafolio(id, Portafolio)
  }

}
