import { Module } from '@nestjs/common';
import { CartaTrabajoService } from './carta-trabajo.service';
import { CartaTrabajoController } from './carta-trabajo.controller';

@Module({
  controllers: [CartaTrabajoController],
  providers: [CartaTrabajoService],
})
export class CartaTrabajoModule {}
