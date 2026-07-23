import { Controller, Get, HttpCode, Inject, UseGuards } from "@nestjs/common";

import { AdminAuthGuard } from "../../guards/admin-auth.guard";
import { DashboardService } from "./dashboard.service";
import type { DashboardDto } from "./dashboard.types";

@Controller("admin/dashboard")
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly dashboard: DashboardService) {}

  @Get() @HttpCode(200)
  @UseGuards(AdminAuthGuard)
  async get(): Promise<DashboardDto> {
    return await this.dashboard.getDashboard();
  }
}

