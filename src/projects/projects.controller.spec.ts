import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthService } from '../auth/auth.service';
import { CustomLoggerService } from '../common/logger/logger.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {

      const mockProjectsService = {
          create: jest.fn(),
          findAll: jest.fn(),
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
      }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
        providers: [
            {
                provide: ProjectsService,
                useValue: mockProjectsService,
            },
            {
                provide: AuthService, // AuthGuard needs this
                useValue: mockAuthService,
            },
            {
                provide: CustomLoggerService, // AuthGuard needs this too
                useValue: mockLoggerService,
            },
        ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
