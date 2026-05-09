import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/why-land", label: "Why Land" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl tracking-wide text-coffee-deep">Veershree</span>
          <span className="text-gold text-lg">·</span>
          <span className="font-serif text-2xl tracking-wide text-coffee-deep">Realty</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[11px] tracking-[0.3em] uppercase text-coffee-deep/80 hover:text-gold transition-colors relative group"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#enquire"
            className="text-[11px] tracking-[0.3em] uppercase bg-coffee-deep text-cream px-5 py-3 hover:bg-coffee transition-colors"
          >
            Enquire
          </a>
        </div>

        <button
          className="md:hidden text-coffee-deep"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-cream border-t border-border animate-fade-up">
          <div className="px-6 py-6 flex flex-col gap-5">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-sm tracking-widest uppercase text-coffee-deep">
                {n.label}
              </Link>
            ))}
            <a href="#enquire" className="bg-coffee-deep text-cream px-5 py-3 text-xs tracking-[0.3em] uppercase text-center">
              Enquire
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
