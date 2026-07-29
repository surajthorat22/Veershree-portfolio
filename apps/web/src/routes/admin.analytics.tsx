import { createFileRoute } from "@tanstack/react-router";
import {
  Eye,
  TrendingUp,
  FolderKanban,
  Inbox,
  Users,
  MousePointerClick,
  CalendarDays,
  MessageSquare,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Analytics } from "@Veershree-portfolio/api";
import { fetchAnalytics } from "@/utils/api";

export const Route = createFileRoute("/admin/analytics")({
  loader: () => fetchAnalytics(),
  component: AnalyticsAdmin,
});

function formatDayLabel(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
}

function AnalyticsAdmin() {
  const analytics = Route.useLoaderData() as Analytics;

  const stats = [
    { Icon: Eye, label: "Visitors today", value: analytics.visitorsToday.toLocaleString() },
    { Icon: Users, label: "Visitors (7d)", value: analytics.visitors7d.toLocaleString() },
    { Icon: MousePointerClick, label: "Page views (7d)", value: analytics.pageViews7d.toLocaleString() },
    { Icon: TrendingUp, label: "Conversion (7d)", value: `${analytics.conversionRate}%` },
    { Icon: Inbox, label: "Enquiries (7d)", value: analytics.enquiries7d.toLocaleString() },
    { Icon: CalendarDays, label: "Total visitors", value: analytics.totalVisitors.toLocaleString() },
    { Icon: MessageSquare, label: "Total enquiries", value: analytics.totalEnquiries.toLocaleString() },
    { Icon: FolderKanban, label: "Total projects", value: analytics.totalProjects.toLocaleString() },
  ];

  const chartData = analytics.viewsByDay.map((day) => ({
    ...day,
    label: formatDayLabel(day.date),
  }));

  const maxTopViews = Math.max(1, ...analytics.topPages.map((p) => p.views));

  return (
    <div className="p-10">
      <div className="eyebrow text-gold mb-2">Insights</div>
      <h1 className="font-serif text-4xl text-coffee-deep">Analytics</h1>
      <p className="text-coffee mt-2">Live visitor traffic and enquiry conversion across the site.</p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ Icon, label, value }) => (
          <div key={label} className="bg-card p-6 border border-border">
            <Icon className="text-gold" size={22} strokeWidth={1.4} />
            <div className="font-serif text-3xl text-coffee-deep mt-6">{value}</div>
            <div className="eyebrow mt-2">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card p-8 border border-border">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl text-coffee-deep">Traffic · last 7 days</h2>
              <p className="text-sm text-coffee mt-1">Unique visitors and page views by day.</p>
            </div>
          </div>

          {analytics.pageViews7d === 0 ? (
            <div className="h-64 flex items-center justify-center border border-dashed border-border">
              <p className="text-sm text-coffee/60 text-center px-6">
                No visits recorded yet. Browse the public site and refresh this page.
              </p>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--coffee-deep)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--coffee-deep)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--coffee)", fontSize: 11 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--coffee)", fontSize: 11 }}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 0,
                      color: "var(--coffee-deep)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    name="Page views"
                    stroke="var(--coffee-deep)"
                    fill="url(#viewsFill)"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Visitors"
                    stroke="var(--gold)"
                    fill="url(#visitorsFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-card p-8 border border-border">
          <h2 className="font-serif text-2xl text-coffee-deep">Top pages</h2>
          <p className="text-sm text-coffee mt-1 mb-8">Most viewed paths in the last 7 days.</p>

          {analytics.topPages.length === 0 ? (
            <p className="text-sm text-coffee/60">No page data yet.</p>
          ) : (
            <div className="space-y-5">
              {analytics.topPages.map((page) => (
                <div key={page.path}>
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <div className="font-mono text-xs text-coffee-deep truncate">{page.path}</div>
                    <div className="eyebrow shrink-0">{page.views} views</div>
                  </div>
                  <div className="h-1.5 bg-sand overflow-hidden">
                    <div
                      className="h-full bg-gold"
                      style={{ width: `${(page.views / maxTopViews) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[11px] text-coffee/60">
                    {page.visitors.toLocaleString()} unique visitor{page.visitors === 1 ? "" : "s"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
