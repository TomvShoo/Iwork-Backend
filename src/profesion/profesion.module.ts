import { Module } from '@nestjs/common';
import { ProfesionService } from './profesion.service';
import { ProfesionController } from './profesion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesion } from './entities/profesion.entity';
import { Profesional } from 'src/profesional/entities/profesional.entity';
import { UsersModule } from 'src/users/users.module';
import { ProfesionalModule } from 'src/profesional/profesional.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profesion, Profesional]), UsersModule, ProfesionalModule
  ],
  controllers: [ProfesionController],
  providers: [ProfesionService,],
})
export class ProfesionModule {}
