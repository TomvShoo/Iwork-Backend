import { Test, TestingModule } from '@nestjs/testing';
import { ProfesionService } from './profesion.service';

describe('ProfesionService', () => {
  let service: ProfesionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfesionService],
    }).compile();

    service = module.get<ProfesionService>(ProfesionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
