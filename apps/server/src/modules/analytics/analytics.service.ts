import { BadRequestException, Inject, Injectable } from "@nestjs/common";

import { EnquiriesService } from "../enquiries/enquiries.service";
import { PrismaService } from "../prisma/prisma.service";
import { ProjectsService } from "../projects/projects.service";
import type { TrackPageViewDto } from "./analytics.dto";
import type { AnalyticsDto, AnalyticsDayDto, AnalyticsTopPageDto } from "./analytics.types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ProjectsService) private readonly projects: ProjectsService,
    @Inject(EnquiriesService) private readonly enquiries: EnquiriesService
  ) {}

  async trackPageView(dto: TrackPageViewDto, userAgent?: string): Promise<{ ok: true }> {
    const path = dto.path.trim();
    const visitorId = dto.visitorId.trim();
    if (!path) throw new BadRequestException("Path is required");
    if (!visitorId) throw new BadRequestException("Visitor id is required");
    if (path.startsWith("/admin")) return { ok: true as const };

    await this.prisma.client.pageView.create({
      data: {
        path,
        visitorId,
        referrer: dto.referrer?.trim() || null,
        userAgent: userAgent?.slice(0, 500) || null,
      },
    });

    return { ok: true as const };
  }

  async countUniqueVisitorsSince(since: Date): Promise<number> {
    const rows = await this.prisma.client.pageView.findMany({
      where: { createdAt: { gte: since } },
      distinct: ["visitorId"],
      select: { visitorId: true },
    });
    return rows.length;
  }

  async countUniqueVisitorsAllTime(): Promise<number> {
    const rows = await this.prisma.client.pageView.findMany({
      distinct: ["visitorId"],
      select: { visitorId: true },
    });
    return rows.length;
  }

  async countPageViewsSince(since: Date): Promise<number> {
    return await this.prisma.client.pageView.count({
      where: { createdAt: { gte: since } },
    });
  }

  async getAnalytics(): Promise<AnalyticsDto> {
    const now = new Date();
    const todayStart = startOfUtcDay(now);
    const sevenDaysAgo = new Date(todayStart.getTime() - 6 * MS_PER_DAY);

    const [projects, totalEnquiries, enquiries7d, visitorsToday, visitors7d, totalVisitors, pageViews7d, recentViews] =
      await Promise.all([
        this.projects.list(),
        this.enquiries.countAll(),
        this.enquiries.countSince(sevenDaysAgo),
        this.countUniqueVisitorsSince(todayStart),
        this.countUniqueVisitorsSince(sevenDaysAgo),
        this.countUniqueVisitorsAllTime(),
        this.countPageViewsSince(sevenDaysAgo),
        this.prisma.client.pageView.findMany({
          where: { createdAt: { gte: sevenDaysAgo } },
          select: { path: true, visitorId: true, createdAt: true },
          orderBy: { createdAt: "asc" },
        }),
      ]);

    const viewsByDay = this.buildViewsByDay(recentViews as Array<{ path: string; visitorId: string; createdAt: Date }>, todayStart);
    const topPages = this.buildTopPages(recentViews as Array<{ path: string; visitorId: string; createdAt: Date }>);
    const conversionRate = visitors7d === 0 ? 0 : Math.round((enquiries7d / visitors7d) * 1000) / 10;

    return {
      visitorsToday,
      visitors7d,
      totalVisitors,
      pageViews7d,
      enquiries7d,
      totalEnquiries,
      totalProjects: projects.length,
      conversionRate,
      viewsByDay,
      topPages,
    };
  }

  private buildViewsByDay(
    views: Array<{ visitorId: string; createdAt: Date }>,
    todayStart: Date
  ): AnalyticsDayDto[] {
    const days: AnalyticsDayDto[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(todayStart.getTime() - i * MS_PER_DAY);
      days.push({ date: toDateKey(day), views: 0, visitors: 0 });
    }

    const dayIndex = new Map(days.map((d, i) => [d.date, i]));
    const visitorsByDay = new Map<string, Set<string>>();

    for (const view of views) {
      const key = toDateKey(new Date(view.createdAt));
      const index = dayIndex.get(key);
      if (index === undefined) continue;
      days[index]!.views += 1;
      let set = visitorsByDay.get(key);
      if (!set) {
        set = new Set();
        visitorsByDay.set(key, set);
      }
      set.add(view.visitorId);
    }

    for (const day of days) {
      day.visitors = visitorsByDay.get(day.date)?.size ?? 0;
    }

    return days;
  }

  private buildTopPages(views: Array<{ path: string; visitorId: string }>): AnalyticsTopPageDto[] {
    const byPath = new Map<string, { views: number; visitors: Set<string> }>();

    for (const view of views) {
      let entry = byPath.get(view.path);
      if (!entry) {
        entry = { views: 0, visitors: new Set() };
        byPath.set(view.path, entry);
      }
      entry.views += 1;
      entry.visitors.add(view.visitorId);
    }

    return [...byPath.entries()]
      .map(([path, data]) => ({
        path,
        views: data.views,
        visitors: data.visitors.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);
  }
}
