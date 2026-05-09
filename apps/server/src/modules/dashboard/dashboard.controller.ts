import { Controller, Get, Inject, UseGuards } from "@nestjs/common";

import { AdminAuthGuard } from "../../guards/admin-auth.guard";
import { DashboardService } from "./dashboard.service";
import type { DashboardDto } from "./dashboard.types";

@Controller("admin/dashboard")
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly dashboard: DashboardService) {}

  @Get()
  @UseGuards(AdminAuthGuard)
  async get(): Promise<DashboardDto> {
    return await this.dashboard.getDashboard();
  }
}

