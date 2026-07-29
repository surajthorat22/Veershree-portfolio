import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { EnquiriesModule } from "./modules/enquiries/enquiries.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { UploadsModule } from "./modules/uploads/uploads.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProjectsModule,
    EnquiriesModule,
    AnalyticsModule,
    DashboardModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
