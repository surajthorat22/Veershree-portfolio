import type { ProjectDto } from "../projects/projects.types";

export type DashboardDto = {
  totalProjects: number;
  totalEnquiries: number;
  visitors7d: number;
  conversionRate: number;
  recentProjects: ProjectDto[];
};

