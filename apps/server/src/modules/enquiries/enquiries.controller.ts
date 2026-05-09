import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards } from "@nestjs/common";

import { AdminAuthGuard } from "../../guards/admin-auth.guard";
import type { CreateEnquiryDto } from "./enquiries.dto";
import { EnquiriesService } from "./enquiries.service";
import type { EnquiryDto } from "./enquiries.types";

@Controller("leads")
export class EnquiriesController {
  constructor(@Inject(EnquiriesService) private readonly enquiries: EnquiriesService) {}

  @Get()
  @UseGuards(AdminAuthGuard)
  async list(): Promise<EnquiryDto[]> {
    return await this.enquiries.list();
  }

  @Post()
  async create(@Body() body: CreateEnquiryDto): Promise<EnquiryDto> {
    return await this.enquiries.create(body);
  }

  @Delete(":id")
  @UseGuards(AdminAuthGuard)
  async remove(@Param("id") id: string): Promise<{ ok: true }> {
    await this.enquiries.deleteById(id);
    return { ok: true as const };
  }
}

