import { Test, TestingModule } from '@nestjs/testing';
import { ProfesionController } from './profesion.controller';
import { ProfesionService } from './profesion.service';

describe('ProfesionController', () => {
  let controller: ProfesionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfesionController],
      providers: [ProfesionService],
    }).compile();

    controller = module.get<ProfesionController>(ProfesionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
