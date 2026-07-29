import { Module } from "@nestjs/common";

import { AnalyticsModule } from "../analytics/analytics.module";
import { EnquiriesModule } from "../enquiries/enquiries.module";
import { ProjectsModule } from "../projects/projects.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  imports: [ProjectsModule, EnquiriesModule, AnalyticsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

