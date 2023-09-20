import { Module } from '@nestjs/common';
import { CartaTrabajoService } from './carta-trabajo.service';
import { CartaTrabajoController } from './carta-trabajo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartaTrabajo } from './entities/carta-trabajo.entity';
import { UsersModule } from 'src/users/users.module';
import { Profesional } from 'src/profesional/entities/profesional.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartaTrabajo, Profesional]), UsersModule],
  controllers: [CartaTrabajoController],
  providers: [CartaTrabajoService],
})
export class CartaTrabajoModule {}
