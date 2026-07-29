import { Inject, Injectable } from "@nestjs/common";

import { AnalyticsService } from "../analytics/analytics.service";
import { EnquiriesService } from "../enquiries/enquiries.service";
import { ProjectsService } from "../projects/projects.service";
import type { DashboardDto } from "./dashboard.types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

@Injectable()
export class DashboardService {
  constructor(
    @Inject(ProjectsService) private readonly projects: ProjectsService,
    @Inject(EnquiriesService) private readonly enquiries: EnquiriesService,
    @Inject(AnalyticsService) private readonly analytics: AnalyticsService
  ) {}

  async getDashboard(): Promise<DashboardDto> {
    const sevenDaysAgo = new Date(startOfUtcDay(new Date()).getTime() - 6 * MS_PER_DAY);

    const [projects, totalEnquiries, enquiries7d, visitors7d] = await Promise.all([
      this.projects.list(),
      this.enquiries.countAll(),
      this.enquiries.countSince(sevenDaysAgo),
      this.analytics.countUniqueVisitorsSince(sevenDaysAgo),
    ]);

    const conversionRate = visitors7d === 0 ? 0 : Math.round((enquiries7d / visitors7d) * 1000) / 10;

    return {
      totalProjects: projects.length,
      totalEnquiries,
      visitors7d,
      conversionRate,
      recentProjects: projects.slice(0, 6),
    };
  }
}
