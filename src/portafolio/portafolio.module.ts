import { Module } from '@nestjs/common';
import { PortafolioService } from './portafolio.service';
import { PortafolioController } from './portafolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portafolio } from './entities/portafolio.entity';import { Profesional } from 'src/profesional/entities/profesional.entity';
import { ProfesionalModule } from 'src/profesional/profesional.module';
;

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Portafolio,
      Profesional
    ]),
    ProfesionalModule
  ],
  controllers: [PortafolioController],
  providers: [PortafolioService],
})
export class PortafolioModule {}
