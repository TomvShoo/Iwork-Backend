import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProfesionService } from './profesion.service';
import { CreateProfesionDto } from './dto/create-profesion.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/rol.enum';

@UseGuards(RolesGuard)
@Controller('profesion')
export class ProfesionController {
  constructor(private readonly profesionService: ProfesionService) { }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() profesion: CreateProfesionDto) {
    return this.profesionService.createProfesion(profesion);
  }

  @Get()
  findAll() {
    return this.profesionService.findAllProfesion();
  }

  @Get(':id_profesion')
  findProfesionalByProfesion(@Param('id_profesion', ParseIntPipe) id: number) {
    return this.profesionService.findById(id);
  }

  @Delete(':id_profesion')
  @Roles(Role.ADMIN)
  deleteProfesion(@Param('id_profesion', ParseIntPipe) id: number) {
    return this.profesionService.deleteProfesion(id);
  }
}
