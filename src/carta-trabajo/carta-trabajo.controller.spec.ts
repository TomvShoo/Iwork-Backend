import { Test, TestingModule } from '@nestjs/testing';
import { CartaTrabajoController } from './carta-trabajo.controller';
import { CartaTrabajoService } from './carta-trabajo.service';

describe('CartaTrabajoController', () => {
  let controller: CartaTrabajoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartaTrabajoController],
      providers: [CartaTrabajoService],
    }).compile();

    controller = module.get<CartaTrabajoController>(CartaTrabajoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
