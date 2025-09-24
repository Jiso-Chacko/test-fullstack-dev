import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalysesDto } from "./dto/create-analyses.dto";
import { UpdateAnalysesDto } from "./dto/update-analyses.dto";
import { CustomLoggerService } from "../common/logger/logger.service";
import {User, Role, PrismaClient} from "@prisma/client";

@Injectable()
export class AnalysesService {
    constructor(
        private prisma: PrismaService,
        private logger: CustomLoggerService,
    ) {}

    private canUserCreateAnalyses(project: any, user: User): boolean{
        if(user.role == Role.SUPER_ADMIN) return true;
        if(user.role == Role.ADMIN) return true;
        return false
    }

    private checkProjectAccess(project: any, user: User): boolean {
        if (user.role === Role.SUPER_ADMIN) return true;
        if (project.ownerId === user.id) return true;

        const hasExplicitAccess = project.accesses?.some(
            (access) => access.userId === user.id,
        );

        return hasExplicitAccess;
    }

    async create(projectId: number, createAnlysesDto: CreateAnalysesDto, user: User) {
        try {
            const project = await this.prisma.project.findUnique({
                where: { id: projectId },
                include: {
                    accesses: { select: { userId: true } },
                }
            })
            if (!project) throw new NotFoundException("Project not found!");

            const canCreate = this.canUserCreateAnalyses(project, user);
            if(!canCreate) throw new ForbiddenException("You are not authorized to create analyses in this project!");

            return this.prisma.analyses.create({
                data: {
                    ...createAnlysesDto,
                    projectId,
                    creatorId: user.id,
                },
                include: {
                    project:{
                        select: { id: true, name: true }
                    },
                    creator: {
                        select: { id: true, name: true, email: true }
                    }
                }
            })
        }catch (error) {
            this.logger.error(error.message, error.stack, "AnalysesService");
            throw error
        }
    }

    async findAllByProject(projectId: number, user: User) {
        try{

            const project = await this.prisma.project.findUnique({
                where: { id: projectId },
                include: {
                    accesses: { select: { userId: true } },
                }
            })
            if (!project) throw new NotFoundException("Project not found!");

            const hasAccess = this.checkProjectAccess(project,user)
            if(!hasAccess) throw new ForbiddenException("You do not have access to this project!");

            return this.prisma.analyses.findMany({
                where: { projectId },
                include: {
                    project:{
                        select: { id: true, name: true }
                    },
                    creator: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        }catch (error) {
            this.logger.error(error.message, error.stack, "AnalysesService");
            throw error
        }
    }

    async findOne(projectId: number, analysisId: number ,user: User) {
        try {

            const analyses = await this.prisma.analyses.findUnique({
                where: { id: analysisId },
                include: {
                    project:{
                        select: { id: true, name: true },
                        include: {
                            accesses: { select: { userId: true } },
                        }
                    },
                    creator: {
                        select: { id: true, name: true, email: true }
                    }
                }

            })

            if(!analyses) throw new NotFoundException("Analysis not found!");
            if(analyses.projectId !== projectId) throw new ForbiddenException("Project not found!");

            const hasAccess = this.checkProjectAccess(analyses.project,user)
            if(!hasAccess) throw new ForbiddenException("You do not have access to this analysis!");

            return analyses;
        }catch (error) {
            this.logger.error(error.message, error.stack, "AnalysesService");
            throw error;
        }
    }

    async update(projectId: number, analysesId: number, updateAnalysesDto: UpdateAnalysesDto, user: User) {
        try {

            const analyses = await this.findOne(projectId, analysesId, user);
            const canUpdate = analyses.creatorId === user.id || analyses.project.ownerId == user.id || user.role == Role.SUPER_ADMIN;
            if(!canUpdate) throw new ForbiddenException("You do not have access to update this analysis!");

            return this.prisma.analyses.update({
                where: { id: analysesId },
                data: updateAnalysesDto,
                include: {
                    project:{
                        select: { id: true, name: true }
                    },
                    creator: {
                        select: { id: true, name: true, email: true }
                    }
                }
            })
        }catch (error) {
            this.logger.error(error.message, error.stack, "AnalysesService");
            throw error
        }
    }

    async remove(projectId: number, analysesId: number ,user: User) {
        try {
            const analyses = await this.findOne(projectId, analysesId, user);

            const canDelete = analyses.creatorId == user.id || analyses.project.ownerId == user.id || user.role == Role.SUPER_ADMIN;
            if(!canDelete) throw new ForbiddenException("You do not have access to delete this analysis!");

            return this.prisma.analyses.delete({
                where: { id: analysesId },
            })
        }catch (error) {
            this.logger.error(error.message, error.stack, "AnalysesService");
            throw  error
        }
    }

}
