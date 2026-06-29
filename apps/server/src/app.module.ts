import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { EnquiriesModule } from "./modules/enquiries/enquiries.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ProjectsModule } from "./modules/projects/projects.module";

@Module({
  imports: [PrismaModule, ProjectsModule, EnquiriesModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
