import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { User, Role, Project } from '@prisma/client'

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) {}

    private checkProjectAccess(project: any, user: User): boolean {
        if (user.role === Role.SUPER_ADMIN) {
            return true;
        }

        if (project.ownerId === user.id) {
            return true;
        }

        const hasExplicitAccess = project.accesses?.some(
            (access) => access.userId === user.id,
        );

        return hasExplicitAccess;
    }

    async create(createProjectDto: CreateProjectDto, user: User) {
        if (user.role == Role.USER) throw new ForbiddenException("Access denied")
        console.log("Inside creation");
        console.log("createProjectDto", createProjectDto);
        const { userIds, ...projectData } = createProjectDto;

        const project = await this.prisma.project.create({
            data: {
                ...projectData,
                ownerId: user.id
            },
            include: {
                owner: {
                    select: { id: true, name: true, email: true },
                }
            }
        })

        // Explicit access
        if (userIds && userIds.length > 0) {
            await this.prisma.projectAccess.createMany({
                data: userIds.map((userId) => ({
                    projectId: project.id,
                    userId: userId,
                }))
            })
        }
        return project;
    }

    async findAll(user: User) {
        console.log("Inside project service")
        console.log("user", user)
        if (user.role == Role.SUPER_ADMIN){
            return this.prisma.project.findMany({
                include: {
                    owner: {
                        select: { id: true, name: true, email: true },
                    },
                    analyses: {
                        select: { id: true, name: true, createdAt: true },
                    }
                }
            })
        }

        if (user.role == Role.ADMIN){
            return this.prisma.project.findMany({
                where: {
                    OR: [
                        {ownerId: user.id},
                        {accesses: { some: { userId: user.id } }}
                    ]
                },
                include: {
                    owner: {
                        select: { id: true, name: true, email: true },
                    },
                    analyses: {
                        select: { id: true, name: true, createdAt: true },
                    }
                }
            })
        }

        return this.prisma.project.findMany({
            where: {
                accesses: { some: { userId: user.id } },
            },
            include: {
                owner: {
                    select: { id: true, name: true, createdAt: true },
                },
                analyses: {
                    select: { id: true, name: true, createdAt: true },
                }
            }
        })
    }

    async  findOne(id: number, user: User) {
        const project = await  this.prisma.project.findUnique({
            where: { id },
            include: {
                owner: {
                    select: { id: true, name: true, email: true },
                },
                analyses: {
                    select: { id: true, name: true, createdAt: true },
                },
                accesses: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        }
                    }
                }
            }
        })

        if (!project) throw  new NotFoundException("Project not Found!");

        const hasAccess = this.checkProjectAccess(project, user)
        if (!hasAccess) throw new ForbiddenException("Access denied")

        return project;
    }


    async update(id: number, updateProjectDto: UpdateProjectDto, user: User) {
        const project = await this.findOne(id, user)

        if (project.ownerId !== user.id && user.role !== Role.SUPER_ADMIN) throw new ForbiddenException("Access denied")

        return this.prisma.project.update({
            where: {id},
            data: updateProjectDto,
            include: {
                owner: {
                    select: { id: true, name: true, email: true },
                }
            }
        })

    }

    async remove(id: number, user: User) {
        const project = await this.findOne(id, user)

        if(project.ownerId !== user.id && user.role !== Role.SUPER_ADMIN) throw new ForbiddenException("Access denied")

        return this.prisma.project.delete({
            where: {id},
        })
    }



}
