import { Body, Controller, Get, HttpCode, Inject, Post, Req, UseGuards } from "@nestjs/common";

import { AdminAuthGuard } from "../../guards/admin-auth.guard";
import type { TrackPageViewDto } from "./analytics.dto";
import { AnalyticsService } from "./analytics.service";
import type { AnalyticsDto } from "./analytics.types";

@Controller()
export class AnalyticsController {
  constructor(@Inject(AnalyticsService) private readonly analytics: AnalyticsService) {}

  @Post("analytics/pageview")
  @HttpCode(200)
  async track(
    @Body() body: TrackPageViewDto,
    @Req() req: { headers?: { "user-agent"?: string } }
  ): Promise<{ ok: true }> {
    return await this.analytics.trackPageView(body, req.headers?.["user-agent"]);
  }

  @Get("admin/analytics")
  @HttpCode(200)
  @UseGuards(AdminAuthGuard)
  async get(): Promise<AnalyticsDto> {
    return await this.analytics.getAnalytics();
  }
}
