import { createFileRoute } from "@tanstack/react-router";
import { Eye, TrendingUp, FolderKanban, Inbox } from "lucide-react";
import { fetchDashboard } from "@/utils/api";

export const Route = createFileRoute("/admin/analytics")({
  loader: () => fetchDashboard(),
  component: AnalyticsAdmin,
});

function AnalyticsAdmin() {
  const dashboard = Route.useLoaderData();

  const stats = [
    { Icon: FolderKanban, label: "Total Projects", value: dashboard.totalProjects.toLocaleString() },
    { Icon: Inbox, label: "Total Enquiries", value: dashboard.totalEnquiries.toLocaleString() },
    { Icon: Eye, label: "Visitors (7d)", value: dashboard.visitors7d.toLocaleString() },
    { Icon: TrendingUp, label: "Conversion Rate", value: `${dashboard.conversionRate}%` },
  ];

  return (
    <div className="p-10">
      <div className="eyebrow text-gold mb-2">Insights</div>
      <h1 className="font-serif text-4xl text-coffee-deep">Analytics</h1>
      <p className="text-coffee mt-2">Overview metrics from the dashboard API.</p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ Icon, label, value }) => (
          <div key={label} className="bg-card p-6 border border-border">
            <Icon className="text-gold" size={22} strokeWidth={1.4} />
            <div className="font-serif text-3xl text-coffee-deep mt-6">{value}</div>
            <div className="eyebrow mt-2">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
