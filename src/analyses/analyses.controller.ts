import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { AnalysesService } from "./analyses.service";
import { CreateAnalysesDto } from "./dto/create-analyses.dto";
import { UpdateAnalysesDto } from "./dto/update-analyses.dto";
import { AuthGuard } from "../common/guards/auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CustomLoggerService } from "../common/logger/logger.service";
import type { User } from '@prisma/client'

@Controller('projects/:projectId/analyses')
@UseGuards(AuthGuard)
export class AnalysesController {
    constructor(
        private readonly analysesService: AnalysesService,
        private logger: CustomLoggerService
    ) {}

    @Post()
    async create(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Body() createAnalysesDto: CreateAnalysesDto,
        @CurrentUser() user: User
    ){
        try {
            return this.analysesService.create(projectId, createAnalysesDto, user)
        }catch (error){
            this.logger.error(error.message, error.stack, "AnalysesController");
            throw error;
        }
    }

    @Get()
    async findAll(
        @Param('projectId', ParseIntPipe) projectId: number,
        @CurrentUser() user: User
    ) {
        try {
            return this.analysesService.findAllByProject(projectId, user)
        }catch (error){
            this.logger.error(error.message, error.stack, "AnalysesController");
            throw error;
        }
    }

    @Get(':id')
    async findOne(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User){
        try {
            return this.analysesService.findOne(projectId, id, user)
        }catch (error){
            this.logger.error(error.message, error.stack, "AnalysesController");
            throw error;
        }
    }

    @Patch(':id')
    async update(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAnalysesDto: UpdateAnalysesDto,
        @CurrentUser() user: User
    ){
        try {
            return this.analysesService.update(projectId, id, updateAnalysesDto, user)
        }catch (error){
            this.logger.error(error.message, error.stack, "AnalysesController");
            throw error;
        }
    }

    @Delete(':id')
    async remove(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User
    ){
        try {
            return this.analysesService.remove(projectId, id, user)
        }catch (error){
            this.logger.error(error.message, error.stack, "AnalysesController");
            throw error;
        }
    }

}

