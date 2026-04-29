import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { projects } from "@/data/projects";
import { ArrowUpRight, FolderKanban, Inbox, Eye, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [leadCount, setLeadCount] = useState(0);
  useEffect(() => {
    const leads = JSON.parse(localStorage.getItem("tn_leads") || "[]");
    setLeadCount(leads.length);
  }, []);

  const stats = [
    { label: "Total Projects", value: String(projects.length), Icon: FolderKanban, link: "/admin/projects" },
    { label: "New Enquiries", value: String(leadCount), Icon: Inbox, link: "/admin/leads" },
    { label: "Visitors (7d)", value: "1,284", Icon: Eye, link: "/admin/analytics" },
    { label: "Conversion", value: "4.6%", Icon: TrendingUp, link: "/admin/analytics" },
  ] as const;

  return (
    <div className="p-10">
      <div className="eyebrow text-gold mb-2">Welcome back</div>
      <h1 className="font-serif text-4xl text-coffee-deep">Dashboard</h1>
      <p className="text-coffee mt-2">A quiet overview of the studio.</p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, Icon, link }) => (
          <Link key={label} to={link} className="bg-card p-6 border border-border hover:border-gold transition group">
            <div className="flex items-start justify-between">
              <Icon className="text-gold" size={22} strokeWidth={1.4} />
              <ArrowUpRight className="text-coffee/40 group-hover:text-gold transition" size={16} />
            </div>
            <div className="font-serif text-4xl text-coffee-deep mt-6">{value}</div>
            <div className="eyebrow mt-2">{label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-8 border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl text-coffee-deep">Recent Projects</h2>
            <Link to="/admin/projects" className="text-[11px] tracking-[0.3em] uppercase text-coffee hover:text-gold">Manage</Link>
          </div>
          <div className="divide-y divide-border">
            {projects.map((p) => (
              <div key={p.id} className="py-4 flex items-center gap-4">
                <img src={p.image} alt="" className="w-16 h-16 object-cover" />
                <div className="flex-1">
                  <div className="font-serif text-lg text-coffee-deep">{p.name}</div>
                  <div className="eyebrow">{p.location}</div>
                </div>
                <span className="text-xs px-2 py-1 bg-sand text-coffee-deep">{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-coffee-deep text-cream p-8">
          <div className="eyebrow text-gold mb-3">Quick Tip</div>
          <h3 className="font-serif text-2xl">Keep your portfolio tight.</h3>
          <p className="text-cream/70 text-sm mt-3 leading-relaxed">
            Showcase 3–6 standout projects. A curated portfolio converts better than a long list.
          </p>
          <Link to="/admin/projects" className="mt-6 inline-flex text-[11px] tracking-[0.3em] uppercase text-gold border-b border-gold pb-1">
            Add Project
          </Link>
        </div>
      </div>
    </div>
  );
}
