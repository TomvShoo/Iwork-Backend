import { Module } from '@nestjs/common';
import { ProfesionalService } from './profesional.service';
import { ProfesionalController } from './profesional.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesional } from './entities/profesional.entity';
import { Portafolio } from 'src/portafolio/entities/portafolio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profesional
    ])
  ],
  controllers: [ProfesionalController],
  providers: [ProfesionalService],
})
export class ProfesionalModule {}
