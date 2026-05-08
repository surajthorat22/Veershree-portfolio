import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import type { CreateEnquiryDto } from "./enquiries.dto";
import type { EnquiryDto } from "./enquiries.types";

@Injectable()
export class EnquiriesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private toDto(e: {
    id: string;
    name: string | null;
    mobile: string;
    location: string | null;
    message: string | null;
    createdAt: Date;
  }): EnquiryDto {
    return {
      id: e.id,
      name: e.name ?? "",
      mobile: e.mobile,
      location: e.location ?? "",
      message: e.message ?? "",
      createdAt: e.createdAt.toISOString(),
    };
  }

  async list(): Promise<EnquiryDto[]> {
    const items = await this.prisma.client.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return (items as any[]).map((e: any) => this.toDto(e));
  }

  async create(dto: CreateEnquiryDto): Promise<EnquiryDto> {
    const created = await this.prisma.client.enquiry.create({
      data: {
        name: dto.name?.trim() || null,
        mobile: dto.mobile.trim(),
        location: dto.location?.trim() || null,
        message: dto.message?.trim() || null,
      },
    });
    return this.toDto(created);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.client.enquiry.delete({ where: { id } }).catch(() => {
      throw new NotFoundException("Enquiry not found");
    });
  }

  async countAll(): Promise<number> {
    return await this.prisma.client.enquiry.count();
  }
}

