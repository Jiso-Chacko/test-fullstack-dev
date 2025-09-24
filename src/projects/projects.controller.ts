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
import type {Project, User} from "@prisma/client";

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    async create(
        @Body() createProjectDto: CreateProjectDto,
        @CurrentUser() user: User,
    ) {
        return this.projectsService.create(createProjectDto, user);
    }

    @Get()
    async findAll(@CurrentUser() user: User) {
        console.log("Inside project controller")
        return this.projectsService.findAll(user)
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User) {
        return this.projectsService.findOne(id, user)
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProjectDto: UpdateProjectDto,
        @CurrentUser() user: User,
    ){
        return this.projectsService.update(id, updateProjectDto, user)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User) {
        return this.projectsService.remove(id, user)
    }

}
