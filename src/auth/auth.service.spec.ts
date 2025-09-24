import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;

    const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
    };


    beforeEach(async () => {

        const mockPrismaService = {
            user: {
                findUnique: jest.fn(),
            },
        };


        const module: TestingModule = await Test.createTestingModule({
          providers: [
              AuthService,
              {
                  provide: PrismaService,
                  useValue: mockPrismaService,
              },
          ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get(PrismaService);
    });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    describe('getUserById', () => {
        it('should return user when found', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.getUserById(1);

            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('should throw UnauthorizedException when user not found', async () => {
            prismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.getUserById(999))
                .rejects.toThrow(UnauthorizedException);
        });
    });

    describe('getUserByEmail', () => {
        it('should return user when found', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.getUserByEmail('test@test.com');

            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@test.com' },
            });
        });

        it('should throw UnauthorizedException when user not found', async () => {
            prismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.getUserByEmail('nonexistent@test.com'))
                .rejects.toThrow(UnauthorizedException);
        });
    });
});
