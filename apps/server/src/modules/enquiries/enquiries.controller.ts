import { Body, Controller, Delete, Get, Inject, Param, Post } from "@nestjs/common";

import type { CreateEnquiryDto } from "./enquiries.dto";
import { EnquiriesService } from "./enquiries.service";
import type { EnquiryDto } from "./enquiries.types";

@Controller("leads")
export class EnquiriesController {
  constructor(@Inject(EnquiriesService) private readonly enquiries: EnquiriesService) {}

  @Get()
  async list(): Promise<EnquiryDto[]> {
    return await this.enquiries.list();
  }

  @Post()
  async create(@Body() body: CreateEnquiryDto): Promise<EnquiryDto> {
    return await this.enquiries.create(body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ ok: true }> {
    await this.enquiries.deleteById(id);
    return { ok: true as const };
  }
}

