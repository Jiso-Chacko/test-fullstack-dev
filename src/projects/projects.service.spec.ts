import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from "../prisma/prisma.service";
import { CustomLoggerService } from "../common/logger/logger.service";
import { ForbiddenException } from "@nestjs/common";
import { Role } from "@prisma/client";

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prismaService: any;

  // Test users
    const mockSuperAdmin = { id: 1, role: Role.SUPER_ADMIN, email: 'superadmin@test.com' };
    const mockAdmin = { id: 2, role: Role.ADMIN, email: 'admin@test.com' };
    const mockUser = { id: 3, role: Role.USER, email: 'user@test.com' };

  beforeEach(async () => {

    const mockPrismaService = {
        project:{
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
        projectAccess: {
            createMany: jest.fn(),
        }
    }

    const mockLoggerService = {
        log: jest.fn(),
        error: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
          ProjectsService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: CustomLoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create project', () => {
      const createProjectDto = { name: "Test Project", userIds: [] };

      it('should allow SUPER ADMIN to create project', async () => {
          const mockProject = { id: 1, name: "Test Project", ownerId: 1 };
          prismaService.project.create.mockResolvedValue(mockProject);

          const result = await service.create(createProjectDto, mockSuperAdmin)
          expect(result).toEqual(mockProject)
      })

      it('should allow ADMIN to create project', async () => {
          const mockProject = { id: 1, name: 'Test Project', ownerId: 2 };
          prismaService.project.create.mockResolvedValue(mockProject);

          const result = await service.create(createProjectDto, mockAdmin);
          expect(result).toEqual(mockProject);
      });


      it('should reject USER from creating project', async () => {
          await expect(service.create(createProjectDto, mockUser))
              .rejects.toThrow(ForbiddenException);
      });
  })

    describe('findAll projects', () => {
        it('should call correct query for SUPER_ADMIN', async () => {
            prismaService.project.findMany.mockResolvedValue([]);

            await service.findAll(mockSuperAdmin);

            expect(prismaService.project.findMany).toHaveBeenCalledWith({
                include: {
                    owner: { select: { id: true, name: true, email: true } },
                    analyses: { select: { id: true, name: true, createdAt: true } },
                },
            });
        });

        it('should call correct query for ADMIN', async () => {
            prismaService.project.findMany.mockResolvedValue([]);

            await service.findAll(mockAdmin);

            expect(prismaService.project.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { ownerId: mockAdmin.id },
                        { accesses: { some: { userId: mockAdmin.id } } },
                    ],
                },
                include: {
                    owner: { select: { id: true, name: true, email: true } },
                    analyses: { select: { id: true, name: true, createdAt: true } },
                },
            });
        });

        it('should call correct query for USER', async () => {
            prismaService.project.findMany.mockResolvedValue([]);

            await service.findAll(mockUser);

            expect(prismaService.project.findMany).toHaveBeenCalledWith({
                where: {
                    accesses: { some: { userId: mockUser.id } },
                },
                include: {
                    owner: { select: { id: true, name: true, email: true } },
                    analyses: { select: { id: true, name: true, createdAt: true } },
                },
            });
        });
    });
});
