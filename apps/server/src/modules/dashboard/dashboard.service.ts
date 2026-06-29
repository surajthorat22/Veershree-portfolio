import { Inject, Injectable } from "@nestjs/common";

import { EnquiriesService } from "../enquiries/enquiries.service";
import { ProjectsService } from "../projects/projects.service";
import type { DashboardDto } from "./dashboard.types";

@Injectable()
export class DashboardService {
  constructor(
    @Inject(ProjectsService) private readonly projects: ProjectsService,
    @Inject(EnquiriesService) private readonly enquiries: EnquiriesService
  ) {}

  async getDashboard(): Promise<DashboardDto> {
    const [projects, totalEnquiries] = await Promise.all([
      this.projects.list(),
      this.enquiries.countAll(),
    ]);

    // Analytics tracking isn't wired yet; provide placeholders for now.
    const visitors7d = 0;
    const conversionRate = visitors7d === 0 ? 0 : totalEnquiries / visitors7d;

    return {
      totalProjects: projects.length,
      totalEnquiries,
      visitors7d,
      conversionRate,
      recentProjects: projects.slice(0, 6),
    };
  }
}

