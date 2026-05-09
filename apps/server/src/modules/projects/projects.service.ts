import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import type { UpsertProjectDto } from "./projects.dto";
import { fromDbProjectStatus, toDbProjectStatus, type ProjectDto, type ProjectStatusDb } from "./projects.types";

function isPrismaNotFoundError(err: unknown): boolean {
  // Prisma "record not found" for update/delete is typically P2025.
  return typeof err === "object" && err !== null && (err as any).code === "P2025";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

@Injectable()
export class ProjectsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private toDto(p: {
    id: string;
    slug: string;
    name: string;
    location: string;
    tagline: string;
    description: string;
    features: string[];
    image: string;
    priceFrom: string;
    size: string;
    status: ProjectStatusDb;
    createdAt: Date;
    updatedAt: Date;
  }): ProjectDto {
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      location: p.location,
      tagline: p.tagline,
      description: p.description,
      features: p.features,
      image: p.image,
      priceFrom: p.priceFrom,
      size: p.size,
      status: fromDbProjectStatus(p.status),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  async list(): Promise<ProjectDto[]> {
    const items = await this.prisma.client.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return (items as any[]).map((p: any) => this.toDto(p as any));
  }

  async getBySlug(slug: string): Promise<ProjectDto> {
    const p = await this.prisma.client.project.findUnique({ where: { slug } });
    if (!p) throw new NotFoundException("Project not found");
    return this.toDto(p as any);
  }

  async upsert(dto: UpsertProjectDto): Promise<ProjectDto> {
    const name = dto.name.trim();
    if (!name) throw new BadRequestException("Name is required");

    const location = dto.location.trim();
    if (!location) throw new BadRequestException("Location is required");

    const slugSource = dto.slug?.trim() ? dto.slug : name;
    const slug = slugify(slugSource);
    if (!slug) throw new BadRequestException("Invalid slug");

    const p = await this.prisma.client.project.upsert({
      where: { slug },
      update: {
        name,
        location,
        tagline: dto.tagline ?? "",
        description: dto.description ?? "",
        features: dto.features ?? [],
        image: dto.image ?? "",
        priceFrom: dto.priceFrom ?? "",
        size: dto.size ?? "",
        status: (toDbProjectStatus(dto.status) ?? "Open") as any,
      },
      create: {
        slug,
        name,
        location,
        tagline: dto.tagline ?? "",
        description: dto.description ?? "",
        features: dto.features ?? [],
        image: dto.image ?? "",
        priceFrom: dto.priceFrom ?? "",
        size: dto.size ?? "",
        status: (toDbProjectStatus(dto.status) ?? "Open") as any,
      },
    });
    return this.toDto(p as any);
  }

  async deleteBySlug(slug: string): Promise<void> {
    try {
      await this.prisma.client.project.delete({ where: { slug } });
    } catch (err) {
      if (isPrismaNotFoundError(err)) throw new NotFoundException("Project not found");
      throw err;
    }
  }
}

