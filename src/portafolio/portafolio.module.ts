import { Module } from '@nestjs/common';
import { PortafolioService } from './portafolio.service';
import { PortafolioController } from './portafolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portafolio } from './entities/portafolio.entity';import { Profesional } from 'src/profesional/entities/profesional.entity';
;

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Portafolio,
      Profesional
    ])
  ],
  controllers: [PortafolioController],
  providers: [PortafolioService],
})
export class PortafolioModule {}
