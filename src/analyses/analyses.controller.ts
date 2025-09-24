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
import type { User } from '@prisma/client'

@Controller('projects/:projectId/analyses')
@UseGuards(AuthGuard)
export class AnalysesController {
    constructor(private readonly analysesService: AnalysesService) {}

    @Post()
    async create(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Body() createAnalysesDto: CreateAnalysesDto,
        @CurrentUser() user: User
    ){
        return this.analysesService.create(projectId, createAnalysesDto, user)
    }

    @Get()
    async findAll(
        @Param('projectId', ParseIntPipe) projectId: number,
        @CurrentUser() user: User
    ) {
        return this.analysesService.findAllByProject(projectId, user)
    }

    @Get(':id')
    async findOne(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User){
        return this.analysesService.findOne(projectId, id, user)
    }

    @Patch(':id')
    async update(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAnalysesDto: UpdateAnalysesDto,
        @CurrentUser() user: User
    ){
        return this.analysesService.update(projectId, id, updateAnalysesDto, user)
    }

    @Delete(':id')
    async remove(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User
    ){
        return this.analysesService.remove(projectId, id, user)
    }

}

