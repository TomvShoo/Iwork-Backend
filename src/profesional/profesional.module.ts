import { Module } from '@nestjs/common';
import { ProfesionalService } from './profesional.service';
import { ProfesionalController } from './profesional.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesional } from './entities/profesional.entity';
import { Portafolio } from 'src/portafolio/entities/portafolio.entity';
import { ProfesionService } from 'src/profesion/profesion.service';
import { Profesion } from 'src/profesion/entities/profesion.entity';
import { UsersService } from 'src/users/users.service';
import { ProfesionModule } from 'src/profesion/profesion.module';
import { Reseña } from 'src/reseña/entities/reseña.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profesional,
      Profesion,
      Reseña
    ])
  ],
  controllers: [ProfesionalController],
  providers: [ProfesionalService, ProfesionService],
  exports: [ProfesionalService]
})
export class ProfesionalModule {}
