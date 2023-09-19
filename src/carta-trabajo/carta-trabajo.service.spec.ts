import { Test, TestingModule } from '@nestjs/testing';
import { CartaTrabajoService } from './carta-trabajo.service';

describe('CartaTrabajoService', () => {
  let service: CartaTrabajoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartaTrabajoService],
    }).compile();

    service = module.get<CartaTrabajoService>(CartaTrabajoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
