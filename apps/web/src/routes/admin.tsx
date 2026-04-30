import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FolderKanban, Inbox, BarChart3, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Terra Noble" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", Icon: FolderKanban, exact: false },
  { to: "/admin/leads", label: "Enquiries", Icon: Inbox, exact: false },
  { to: "/admin/analytics", label: "Analytics", Icon: BarChart3, exact: false },
] as const;

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-64 bg-coffee-deep text-cream/90 flex flex-col">
        <div className="px-6 py-6 border-b border-cream/10">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-xl text-cream">Terra</span>
            <span className="text-gold">·</span>
            <span className="font-serif text-xl text-cream">Noble</span>
          </div>
          <div className="eyebrow text-gold mt-1">Admin Studio</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map(({ to, label, Icon, exact }) => {
            const active = exact ? path === to : path.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition rounded-sm ${
                  active ? "bg-cream/10 text-gold" : "hover:bg-cream/5 text-cream/70"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-cream/10">
          <Link to="/" className="flex items-center gap-2 text-xs text-cream/60 hover:text-gold px-3 py-2">
            <ArrowLeft size={14} /> Back to site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
