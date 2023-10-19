import { Module } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { ReseñaController } from './reseña.controller';
import { Reseña } from './entities/reseña.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reseña
    ])
  ],
  controllers: [ReseñaController],
  providers: [ReseñaService],
})
export class ReseñaModule {}
