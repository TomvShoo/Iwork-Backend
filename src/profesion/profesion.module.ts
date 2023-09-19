import { Module } from '@nestjs/common';
import { ProfesionService } from './profesion.service';
import { ProfesionController } from './profesion.controller';

@Module({
  controllers: [ProfesionController],
  providers: [ProfesionService],
})
export class ProfesionModule {}
