import { Test, TestingModule } from '@nestjs/testing';
import { AnalysesService } from './analyses.service';
import { PrismaService } from '../prisma/prisma.service';
import { CustomLoggerService } from '../common/logger/logger.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('AnalysesService', () => {
  let service: AnalysesService;
    let prismaService: any;

    const mockSuperAdmin = { id: 1, role: Role.SUPER_ADMIN };
    const mockAdmin = { id: 2, role: Role.ADMIN };
    const mockUser = { id: 3, role: Role.USER };

    beforeEach(async () => {
        const mockPrismaService = {
            project: {
                findUnique: jest.fn(),
            },
            analyses: {
                create: jest.fn(),
                findMany: jest.fn(),
            },
        };

        const mockLoggerService = {
            log: jest.fn(),
            error: jest.fn(),
        };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
          AnalysesService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: CustomLoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<AnalysesService>(AnalysesService);
    prismaService = module.get(PrismaService);

    });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    describe('create analysis', () => {
        const createAnalysisDto = { name: 'Test Analysis' };
        const mockProject = { id: 1, ownerId: 2, accesses: [] }; // Owned by admin

        it('should allow SUPER_ADMIN to create analysis', async () => {
            prismaService.project.findUnique.mockResolvedValue(mockProject);
            const mockAnalysis = { id: 1, name: 'Test Analysis', projectId: 1 };
            prismaService.analyses.create.mockResolvedValue(mockAnalysis);

            const result = await service.create(1, createAnalysisDto, mockSuperAdmin);
            expect(result).toEqual(mockAnalysis);
        });

        it('should allow ADMIN to create analysis in own project', async () => {
            prismaService.project.findUnique.mockResolvedValue(mockProject);
            const mockAnalysis = { id: 1, name: 'Test Analysis', projectId: 1 };
            prismaService.analyses.create.mockResolvedValue(mockAnalysis);

            const result = await service.create(1, createAnalysisDto, mockAdmin);
            expect(result).toEqual(mockAnalysis);
        });

        it('should reject USER from creating analysis', async () => {
            const projectWithUserAccess = {
                id: 1,
                ownerId: 2,
                accesses: [{ userId: 3 }] // User has access but cannot create
            };
            prismaService.project.findUnique.mockResolvedValue(projectWithUserAccess);

            await expect(service.create(1, createAnalysisDto, mockUser))
                .rejects.toThrow(ForbiddenException);
        });

        it('should reject when project not found', async () => {
            prismaService.project.findUnique.mockResolvedValue(null);

            await expect(service.create(999, createAnalysisDto, mockAdmin))
                .rejects.toThrow(NotFoundException);
        });
    });

    describe('findAllByProject', () => {
        it('should return analyses for users with project access', async () => {
            const mockProject = { id: 1, ownerId: 3, accesses: [{ userId: 3 }] };
            const mockAnalyses = [{ id: 1, name: 'Test Analysis' }];

            prismaService.project.findUnique.mockResolvedValue(mockProject);
            prismaService.analyses.findMany.mockResolvedValue(mockAnalyses);

            const result = await service.findAllByProject(1, mockUser);
            expect(result).toEqual(mockAnalyses);
        });

        it('should reject users without project access', async () => {
            const mockProject = { id: 1, ownerId: 2, accesses: [] }; // No access for user
            prismaService.project.findUnique.mockResolvedValue(mockProject);

            await expect(service.findAllByProject(1, mockUser))
                .rejects.toThrow(ForbiddenException);
        });
    });
});
