import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfesionalService } from './profesional.service';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { UpdateProfesionalDto } from './dto/update-profesional.dto';
import { Profesional } from './entities/profesional.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Auth(Role.PROFESIONAL)
@Controller('profesional')
export class ProfesionalController {
  constructor(private profesionalService: ProfesionalService) {}

  @Post()
  createUser(@Body() NewProfesional: CreateProfesionalDto) {
    return this.profesionalService.createProfesional(NewProfesional)
  }

  @Get()
  getProfesionals(): Promise<Profesional[]> {
    return this.profesionalService.getProfesionals()
  }

  @Get(':id')
  getProfesional(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalService.getProfesional(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfesionalDto: UpdateProfesionalDto) {
    return this.profesionalService.updateProfesional(+id, updateProfesionalDto);
  }

  @Delete(':id')
  deleteProfesional(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalService.deleteProfesional(id)
  }

}

