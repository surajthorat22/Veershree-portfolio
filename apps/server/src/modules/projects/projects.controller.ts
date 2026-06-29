import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from "@nestjs/common";

import { AdminAuthGuard } from "../../guards/admin-auth.guard";
import type { UpsertProjectDto } from "./projects.dto";
import { ProjectsService } from "./projects.service";
import type { ProjectDto } from "./projects.types";

@Controller("projects")
export class ProjectsController {
  constructor(@Inject(ProjectsService) private readonly projects: ProjectsService) {}

  @Get()
  async list(): Promise<ProjectDto[]> {
    return await this.projects.list();
  }

  @Get(":slug")
  async get(@Param("slug") slug: string): Promise<ProjectDto> {
    return await this.projects.getBySlug(slug);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  async create(@Body() body: UpsertProjectDto): Promise<ProjectDto> {
    return await this.projects.upsert(body);
  }

  @Put(":slug")
  @UseGuards(AdminAuthGuard)
  async update(@Param("slug") slug: string, @Body() body: UpsertProjectDto): Promise<ProjectDto> {
    return await this.projects.upsert({ ...body, slug });
  }

  @Delete(":slug")
  @UseGuards(AdminAuthGuard)
  async remove(@Param("slug") slug: string): Promise<{ ok: true }> {
    await this.projects.deleteBySlug(slug);
    return { ok: true as const };
  }
}

