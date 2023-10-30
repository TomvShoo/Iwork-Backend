import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProfesionService } from './profesion.service';
import { CreateProfesionDto } from './dto/create-profesion.dto';
import { UpdateProfesionDto } from './dto/update-profesion.dto';

@Controller('profesion')
export class ProfesionController {
  constructor(private readonly profesionService: ProfesionService) { }

  @Post()
  create(@Body() profesion: CreateProfesionDto) {
    return this.profesionService.createProfesion(profesion);
  }

  @Get()
  findAll() {
    return this.profesionService.findAllProfesion();
  }

  @Delete(':id_profesion')
  deleteProfesion(@Param('id_profesion', ParseIntPipe) id: number) {
    return this.profesionService.deleteProfesion(id);
  }
}
