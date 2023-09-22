import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfesionService } from './profesion.service';
import { CreateProfesionDto } from './dto/create-profesion.dto';
import { UpdateProfesionDto } from './dto/update-profesion.dto';

@Controller('profesion')
export class ProfesionController {
  constructor(private readonly profesionService: ProfesionService) {}

  @Post()
  create(@Body() profesion: CreateProfesionDto) {
    return this.profesionService.createProfesion(profesion);
  }

  @Get()
  findAll() {
    return this.profesionService.findAllProfesion();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.profesionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProfesionDto: UpdateProfesionDto) {
  //   return this.profesionService.update(+id, updateProfesionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.profesionService.remove(+id);
  // }
}