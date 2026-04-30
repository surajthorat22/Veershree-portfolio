import { createFileRoute, Link } from "@tanstack/react-router";
import { projects } from "@/data/projects";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { ArrowUpRight, MapPin } from "lucide-react";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Terra Noble" },
      { name: "description", content: "Browse our portfolio of premium gated land developments across India." },
      { property: "og:title", content: "Premium Land Projects — Terra Noble" },
      { property: "og:description", content: "Hand-picked land parcels in India's most strategic growth corridors." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <>
      <section className="pt-40 pb-16 bg-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="eyebrow text-gold mb-4">The Portfolio</div>
          <h1 className="font-serif text-5xl lg:text-7xl text-coffee-deep leading-tight max-w-4xl">
            A collection of <em className="text-coffee">extraordinary</em> land.
          </h1>
          <p className="mt-6 text-coffee max-w-xl leading-relaxed">
            Each project is curated for its location, infrastructure, and long-term potential — and quietly stewarded long after handover.
          </p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid gap-16">
          {projects.map((p, i) => (
            <article key={p.id} className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="aspect-[4/3] overflow-hidden shadow-card group">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" width={1200} height={900} loading="lazy" />
              </div>
              <div>
                <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-coffee">
                  <MapPin size={12} /> {p.location}
                  <span className="ml-2 px-2 py-1 bg-gold-soft text-coffee-deep text-[10px]">{p.status}</span>
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl text-coffee-deep mt-4 leading-tight">{p.name}</h2>
                <p className="mt-4 text-coffee leading-relaxed max-w-lg">{p.description}</p>
                <ul className="mt-8 grid grid-cols-2 gap-4">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 items-start text-sm text-coffee-deep">
                      <span className="text-gold mt-1">·</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-end justify-between border-t border-border pt-6">
                  <div>
                    <div className="eyebrow">Plot sizes</div>
                    <div className="font-serif text-lg text-coffee-deep">{p.size}</div>
                  </div>
                  <div>
                    <div className="eyebrow">From</div>
                    <div className="font-serif text-2xl text-coffee-deep">{p.priceFrom}</div>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <Link to="/projects/$id" params={{ id: p.id }} className="bg-coffee-deep text-cream px-6 py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-coffee transition flex items-center gap-2">
                    View Details <ArrowUpRight size={12} />
                  </Link>
                  <a href="#enquire" className="px-6 py-3 text-[11px] tracking-[0.3em] uppercase border border-coffee-deep text-coffee-deep hover:bg-coffee-deep hover:text-cream transition">
                    Enquire
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="enquire" className="py-24 bg-coffee-deep">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-cream">
            <div className="eyebrow text-gold mb-4">Reserve a Visit</div>
            <h2 className="font-serif text-4xl lg:text-5xl">A private site visit, on your schedule.</h2>
            <p className="mt-4 text-cream/70">Share your details. We'll arrange transport and a personal walkthrough.</p>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
