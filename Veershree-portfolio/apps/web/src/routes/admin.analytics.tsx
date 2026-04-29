import { createFileRoute } from "@tanstack/react-router";
import { Eye, Users, MousePointerClick, MapPin } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsAdmin,
});

function AnalyticsAdmin() {
  const stats = [
    { Icon: Eye, label: "Total Visitors", value: "12,840", change: "+18%" },
    { Icon: Users, label: "Unique Users", value: "8,420", change: "+12%" },
    { Icon: MousePointerClick, label: "Lead Conversion", value: "4.6%", change: "+0.8pt" },
    { Icon: MapPin, label: "Top City", value: "Bengaluru", change: "32%" },
  ];

  const cities = [
    { c: "Bengaluru", v: 4120, p: 32 },
    { c: "Chennai", v: 2680, p: 21 },
    { c: "Hyderabad", v: 1980, p: 15 },
    { c: "Mumbai", v: 1420, p: 11 },
    { c: "Delhi NCR", v: 1180, p: 9 },
    { c: "Other", v: 1460, p: 12 },
  ];

  const days = [42, 51, 38, 64, 72, 58, 88, 95, 82, 110, 124, 118, 142, 158];
  const max = Math.max(...days);

  return (
    <div className="p-10">
      <div className="eyebrow text-gold mb-2">Insights</div>
      <h1 className="font-serif text-4xl text-coffee-deep">Analytics</h1>
      <p className="text-coffee mt-2">Sample dashboard — connect a backend to track real data.</p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ Icon, label, value, change }) => (
          <div key={label} className="bg-card p-6 border border-border">
            <div className="flex items-center justify-between">
              <Icon className="text-gold" size={22} strokeWidth={1.4} />
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{change}</span>
            </div>
            <div className="font-serif text-3xl text-coffee-deep mt-6">{value}</div>
            <div className="eyebrow mt-2">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-8 border border-border">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl text-coffee-deep">Visitors · Last 14 days</h2>
            <span className="eyebrow">Daily</span>
          </div>
          <div className="flex items-end gap-2 h-48">
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-coffee-deep to-gold rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${(d / max) * 100}%` }}
                  title={`${d} visitors`}
                />
                <span className="text-[10px] text-coffee/60">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-8 border border-border">
          <h2 className="font-serif text-2xl text-coffee-deep mb-6">Visitors by City</h2>
          <div className="space-y-4">
            {cities.map(({ c, v, p }) => (
              <div key={c}>
                <div className="flex justify-between text-sm">
                  <span className="text-coffee-deep">{c}</span>
                  <span className="text-coffee">{v.toLocaleString()}</span>
                </div>
                <div className="mt-1.5 h-1.5 bg-sand rounded-full overflow-hidden">
                  <div className="h-full bg-gold" style={{ width: `${(p / 32) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
