import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import type { UpsertProjectDto } from "./projects.dto";
import type { ProjectDto, ProjectStatusDto } from "./projects.types";

type DbProjectStatus = "Open" | "FewLeft" | "SoldOut";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toDbStatus(status: ProjectStatusDto | undefined): DbProjectStatus | undefined {
  if (!status) return undefined;
  if (status === "Few Left") return "FewLeft";
  if (status === "Sold Out") return "SoldOut";
  return "Open";
}

function fromDbStatus(status: DbProjectStatus): ProjectStatusDto {
  if (status === "FewLeft") return "Few Left";
  if (status === "SoldOut") return "Sold Out";
  return "Open";
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
    status: DbProjectStatus;
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
      status: fromDbStatus(p.status),
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
    const slug = dto.slug?.trim() ? slugify(dto.slug) : slugify(dto.name);
    const p = await this.prisma.client.project.upsert({
      where: { slug },
      update: {
        name: dto.name,
        location: dto.location,
        tagline: dto.tagline ?? "",
        description: dto.description ?? "",
        features: dto.features ?? [],
        image: dto.image ?? "",
        priceFrom: dto.priceFrom ?? "",
        size: dto.size ?? "",
        status: (toDbStatus(dto.status) ?? "Open") as any,
      },
      create: {
        slug,
        name: dto.name,
        location: dto.location,
        tagline: dto.tagline ?? "",
        description: dto.description ?? "",
        features: dto.features ?? [],
        image: dto.image ?? "",
        priceFrom: dto.priceFrom ?? "",
        size: dto.size ?? "",
        status: (toDbStatus(dto.status) ?? "Open") as any,
      },
    });
    return this.toDto(p as any);
  }

  async deleteBySlug(slug: string): Promise<void> {
    await this.prisma.client.project.delete({ where: { slug } }).catch(() => {
      throw new NotFoundException("Project not found");
    });
  }
}

