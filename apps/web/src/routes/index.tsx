import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { Project } from "@Veershree-portfolio/api/index";
import heroImg from "@/assets/hero-aerial.jpg";
import topo from "@/assets/topo-pattern.jpg";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { JsonLd } from "@/components/site/JsonLd";
import { ProjectsGridSkeleton, QueryEmpty, QueryError } from "@/components/site/QueryFeedback";
import { ArrowUpRight, ShieldCheck, Trees, TrendingUp, MapPin, Quote } from "lucide-react";
import { breadcrumbJsonLd, buildPageHead, SITE } from "@/lib/seo";
import { fetchProjects } from "@/utils/api";

export const Route = createFileRoute("/")({
  // No route loader — home must paint immediately even when the API is cold-starting.
  head: () =>
    buildPageHead({
      title: "Veershree Realty — Premium Land Investments in Pune",
      description: SITE.description,
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setProjectsError(null);
    setProjects(null);
    void fetchProjects()
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setProjectsError(err instanceof Error ? err.message : "Failed to load projects");
        setProjects([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function retryProjects() {
    setProjectsError(null);
    setProjects(null);
    void fetchProjects()
      .then((data) => setProjects(data))
      .catch((err: unknown) => {
        setProjectsError(err instanceof Error ? err.message : "Failed to load projects");
        setProjects([]);
      });
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
        ])}
      />
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Aerial view of premium land plots" className="w-full h-full object-cover animate-ken-burns" width={1920} height={1200} />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/30 to-cream/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/70 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-24 sm:pb-20 pt-28 sm:pt-40 w-full min-w-0 pr-14 sm:pr-6 lg:pr-10">
          <div className="max-w-2xl w-full min-w-0 animate-fade-up">
            <div className="eyebrow text-coffee-deep mb-4 sm:mb-6">
              <span className="gold-rule" />
              Est. 2010 · Premium Land
            </div>
            <h1 className="font-serif text-[2.15rem] leading-[1.1] sm:text-5xl sm:leading-[1.05] lg:text-7xl text-coffee-deep tracking-tight break-words">
              Invest in <em className="text-coffee italic">land</em>,<br />
              inherit a <em className="text-coffee italic">legacy</em>.
            </h1>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-coffee max-w-lg leading-relaxed">
              Curated plots in India's most strategic corridors. Clear titles, gated communities, and the patient compounding only land can offer.
            </p>

            <div className="mt-7 sm:mt-10 flex flex-col gap-4 items-stretch sm:items-start w-full min-w-0">
              <EnquiryForm variant="compact" />
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 self-start px-1 sm:px-5 py-2 sm:py-3 text-[11px] tracking-[0.3em] uppercase text-coffee-deep border-b border-coffee-deep hover:text-gold hover:border-gold transition-colors"
              >
                View Projects <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          <div className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8 max-w-3xl border-t border-coffee/20 pt-8 sm:pt-10">
            {[
              { k: "16", v: "Years Curating Land" },
              { k: "20+", v: "Projects Delivered" },
              { k: "2,400+", v: "Investors Served" },
              { k: "100%", v: "Clear Titles" },
            ].map((s) => (
              <div key={s.v} className="min-w-0">
                <div className="font-serif text-2xl sm:text-3xl text-coffee-deep">{s.k}</div>
                <div className="eyebrow mt-1 text-coffee !tracking-[0.18em] sm:!tracking-[0.4em] text-[0.62rem] sm:text-[0.7rem] leading-snug">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO QUOTE */}
      <section className="bg-sand py-16 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Quote className="mx-auto text-gold" size={36} />
          <p className="mt-6 font-serif text-2xl sm:text-3xl lg:text-4xl text-coffee-deep leading-snug italic">
            "They don't make land anymore. We simply find the parcels worth keeping for a generation."
          </p>
          <div className="eyebrow mt-8 text-coffee">— Aniket Kedari, Founding Partner</div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-16 sm:py-24 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-16">
            <div>
              <div className="eyebrow text-gold mb-4">Featured Projects</div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-coffee-deep max-w-2xl leading-tight">
                A portfolio of <em className="text-coffee">extraordinary</em> land.
              </h2>
            </div>
            <Link to="/projects" className="text-[11px] tracking-[0.3em] uppercase text-coffee-deep hover:text-gold transition flex items-center gap-2">
              View all projects <ArrowUpRight size={14} />
            </Link>
          </div>

          {projects === null ? (
            <ProjectsGridSkeleton count={3} />
          ) : projectsError ? (
            <QueryError message={projectsError} onRetry={retryProjects} />
          ) : projects.length === 0 ? (
            <QueryEmpty title="No projects yet" description="Check back soon for our latest land offerings." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p, i) => (
                <article key={p.id} className="group bg-card shadow-card overflow-hidden hover:shadow-soft transition-all duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" width={1200} height={900} loading="lazy" />
                    <div className="absolute top-4 left-4 bg-cream/90 backdrop-blur px-3 py-1 text-[10px] tracking-[0.25em] uppercase text-coffee-deep">
                      {p.status}
                    </div>
                  </div>
                  <div className="p-7">
                    <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-coffee/70">
                      <MapPin size={12} /> {p.location}
                    </div>
                    <h3 className="font-serif text-2xl text-coffee-deep mt-3">{p.name}</h3>
                    <p className="mt-2 text-sm text-coffee leading-relaxed">{p.tagline}</p>
                    <div className="mt-5 flex justify-between items-end pt-5 border-t border-border">
                      <div>
                        <div className="eyebrow">From</div>
                        <div className="font-serif text-xl text-coffee-deep">{p.priceFrom}</div>
                      </div>
                      <Link
                        to="/projects/$slug"
                        params={{ slug: p.slug }}
                        className="text-[11px] tracking-[0.3em] uppercase text-coffee-deep hover:text-gold flex items-center gap-1.5"
                      >
                        Details <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="relative py-16 sm:py-24 lg:py-32 bg-coffee-deep text-cream overflow-hidden">
        <img src={topo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen" loading="lazy" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="eyebrow text-gold mb-4">Why Veershree Realty</div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight">
              The discipline of <em className="text-gold">land</em>, the discretion of a private bank.
            </h2>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { Icon: ShieldCheck, t: "Clear Documentation", d: "DTCP & RERA compliant. Title insurance and legal scrutiny on every parcel." },
              { Icon: TrendingUp, t: "Considered ROI", d: "Average appreciation of 18% CAGR across our portfolio over the last decade." },
              { Icon: Trees, t: "Premium Locations", d: "Hand-picked corridors with infrastructure, water tables, and natural beauty." },
              { Icon: MapPin, t: "Strategic Foresight", d: "We invest where the city is going — not where it already is." },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="border-t border-cream/15 pt-6">
                <Icon className="text-gold" size={28} strokeWidth={1.2} />
                <h3 className="font-serif text-2xl mt-5 text-cream">{t}</h3>
                <p className="text-sm text-cream/70 mt-3 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTMENT BENEFITS */}
      <section className="py-16 sm:py-24 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img src={topo} alt="Topographic map illustration" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 ring-1 ring-coffee-deep/10" />
          </div>
          <div>
            <div className="eyebrow text-gold mb-4">Land vs Apartments</div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-coffee-deep leading-tight">
              Why the <em className="text-coffee">wealthy</em><br />build on land.
            </h2>
            <p className="mt-6 text-coffee leading-relaxed max-w-lg">
              Apartments depreciate. Land doesn't. While buildings age, the ground beneath them quietly compounds — through scarcity, demand, and time.
            </p>
            <ul className="mt-10 space-y-6">
              {[
                ["Appreciation", "Land in growth corridors has historically outpaced apartment ROI by 3–4×."],
                ["Flexibility", "Hold, develop, lease or pass on. Land never closes a single door."],
                ["Lower Maintenance", "No society dues, no aging structure, no recurring depreciation."],
                ["Generational Asset", "An inheritance that works while it waits."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-5 border-b border-border pb-6">
                  <div className="font-serif text-3xl text-gold leading-none">·</div>
                  <div>
                    <div className="font-serif text-xl text-coffee-deep">{t}</div>
                    <div className="text-sm text-coffee mt-1">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="py-16 sm:py-24 lg:py-32 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10 sm:mb-12">
            <div className="eyebrow text-gold mb-4">Locations</div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-coffee-deep">
              Strategically <em className="text-coffee">positioned</em>.
            </h2>
          </div>
          <div className="aspect-[16/10] sm:aspect-[16/8] w-full overflow-hidden shadow-soft border border-border">
            <iframe
              title="Project locations"
              src="https://www.google.com/maps?q=chakan+pune+maharashtra&output=embed&z=13"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 lg:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10 sm:mb-16">
            <div className="eyebrow text-gold mb-4">In Their Words</div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-coffee-deep">
              The voices of <em className="text-coffee">our investors</em>.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { q: "Veershree Realty made acquiring land feel like buying art — considered, transparent, and quietly powerful.", n: "Suraj T.", r: "Family Office, Pune" },
              { q: "I have invested with three developers. Only one returned my calls a decade later. That speaks volumes.", n: "Kalpesh P.", r: "Investor, Pune" },
              { q: "From documentation to handover, the experience was reminiscent of private banking.", n: "Sarang G.", r: "Customer, Pune" },
            ].map((t) => (
              <figure key={t.n} className="bg-sand p-6 sm:p-8 border-t-2 border-gold">
                <Quote className="text-gold" size={22} />
                <blockquote className="font-serif text-lg sm:text-xl text-coffee-deep mt-4 italic leading-snug">"{t.q}"</blockquote>
                <figcaption className="mt-6">
                  <div className="font-serif text-base text-coffee-deep">{t.n}</div>
                  <div className="eyebrow mt-1">{t.r}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE */}
      <section id="enquire" className="py-16 sm:py-24 lg:py-32 pb-28 sm:pb-24 lg:pb-32 bg-coffee-deep relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-deep to-coffee" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div className="text-cream min-w-0">
            <div className="eyebrow text-gold mb-4">Begin the Conversation</div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl leading-[1.05]">
              Land doesn't wait.<br /><em className="text-gold italic">Neither should you.</em>
            </h2>
            <p className="mt-6 text-cream/70 max-w-md leading-relaxed text-sm sm:text-base">
              Share your details and our investment advisor will reach out within one business hour. No pressure, no spam — only a quiet conversation about land.
            </p>
            <div className="mt-8 sm:mt-10 flex items-center gap-6">
              <div>
                <div className="eyebrow text-gold">Direct line</div>
                <div className="font-serif text-xl sm:text-2xl text-cream mt-1">+91 78755 81414</div>
              </div>
            </div>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
