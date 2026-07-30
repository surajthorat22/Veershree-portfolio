import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StickyContact } from "@/components/site/StickyContact";
import { PageViewTracker } from "@/components/site/PageViewTracker";
import { JsonLd } from "@/components/site/JsonLd";
import { buildPageHead, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow text-gold mb-6">Error 404</div>
        <h1 className="font-serif text-6xl text-coffee-deep">Page not found</h1>
        <p className="mt-4 text-sm text-coffee">The page you're looking for has moved or no longer exists.</p>
        <div className="mt-8">
          <Link to="/" className="inline-flex items-center bg-coffee-deep text-cream px-6 py-3 text-xs tracking-[0.3em] uppercase hover:bg-coffee transition">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const rootHead = buildPageHead({
  title: "Veershree Realty | Veershree Real Estate — Premium Land Investments in Pune",
  description:
    "Veershree Realty (Veershree Real Estate) offers premium land plots, gated communities and clear-title real estate investments in Chakan, Pune and India's growth corridors.",
  path: "/",
});

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, ...rootHead.meta],
    links: [{ rel: "stylesheet", href: appCss }, { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.svg` }, ...rootHead.links],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeadContent />
      {children}
      <Scripts />
    </>
  );
}

function RootComponent() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = path.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <PageViewTracker />
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      <StickyContact />
      <Toaster />
    </>
  );
}
