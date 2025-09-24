import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Patch,
    Param,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from "../common/guards/auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CustomLoggerService } from "../common/logger/logger.service";
import type {Project, User} from "@prisma/client";

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private logger: CustomLoggerService
    ) {}

    @Post()
    async create(
        @Body() createProjectDto: CreateProjectDto,
        @CurrentUser() user: User,
    ) {
        try {
            return this.projectsService.create(createProjectDto, user);
        }catch (error) {
            this.logger.error(error.message, error.stack, "ProjectsController");
            throw error
        }
    }

    @Get()
    async findAll(@CurrentUser() user: User) {
        try {
            return this.projectsService.findAll(user)
        }catch (error) {
            this.logger.error(error.message, error.stack, "ProjectsController");
            throw error;
        }
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User) {
        try {
            return this.projectsService.findOne(id, user)
        }catch (error) {
            this.logger.error(error.message, error.stack, "ProjectsController");
            throw error;
        }
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProjectDto: UpdateProjectDto,
        @CurrentUser() user: User,
    ){
        try {
            return this.projectsService.update(id, updateProjectDto, user)
        }catch (error) {
            this.logger.error(error.message, error.stack, "ProjectsController");
            throw error;
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User) {
        try {
            return this.projectsService.remove(id, user)
        }catch (error) {
            this.logger.error(error.message, error.stack, "ProjectsController");
            throw error;
        }
    }

}
