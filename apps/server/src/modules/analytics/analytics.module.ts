import { Module } from "@nestjs/common";

import { EnquiriesModule } from "../enquiries/enquiries.module";
import { ProjectsModule } from "../projects/projects.module";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

@Module({
  imports: [ProjectsModule, EnquiriesModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
