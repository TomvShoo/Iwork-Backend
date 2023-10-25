import { Module } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { ReseñaController } from './reseña.controller';
import { Reseña } from './entities/reseña.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesionalService } from 'src/profesional/profesional.service';
import { Profesional } from 'src/profesional/entities/profesional.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reseña,
      Profesional,
      User
    ])
  ],
  controllers: [ReseñaController],
  providers: [ReseñaService],
})
export class ReseñaModule {}
