import { Test, TestingModule } from '@nestjs/testing';
import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { AuthService } from '../auth/auth.service';
import { CustomLoggerService } from '../common/logger/logger.service';

describe('AnalysesController', () => {
  let controller: AnalysesController;

  beforeEach(async () => {

      const mockAnalysesService = {
          create: jest.fn(),
          findAllByProject: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
      };

      const mockAuthService = {
          getUserById: jest.fn(),
          getUserByEmail: jest.fn(),
      };

      const mockLoggerService = {
          log: jest.fn(),
          error: jest.fn(),
          warn: jest.fn(),
      };


      const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysesController],
          providers: [
              {
                  provide: AnalysesService,
                  useValue: mockAnalysesService,
              },
              {
                  provide: AuthService,
                  useValue: mockAuthService,
              },
              {
                  provide: CustomLoggerService,
                  useValue: mockLoggerService,
              },
          ],
    }).compile();

    controller = module.get<AnalysesController>(AnalysesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
