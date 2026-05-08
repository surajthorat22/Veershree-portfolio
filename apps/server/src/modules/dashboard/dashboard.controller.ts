import { Controller, Get, Inject } from "@nestjs/common";

import { DashboardService } from "./dashboard.service";
import type { DashboardDto } from "./dashboard.types";

@Controller("admin/dashboard")
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly dashboard: DashboardService) {}

  @Get()
  async get(): Promise<DashboardDto> {
    return await this.dashboard.getDashboard();
  }
}

