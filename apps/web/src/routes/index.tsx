import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-aerial.jpg";
import topo from "@/assets/topo-pattern.jpg";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { projects } from "@/data/projects";
import { ArrowUpRight, ShieldCheck, Trees, TrendingUp, MapPin, Quote } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Terra Noble — Premium Land Investments in India" },
      { name: "description", content: "Curated premium land plots in India's most strategic corridors. Clear titles, gated communities, generational value." },
      { property: "og:title", content: "Terra Noble — Invest in Land, Inherit a Legacy" },
      { property: "og:description", content: "Hand-picked plots in growth corridors. Trusted by 2,400+ investors." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Aerial view of premium land plots" className="w-full h-full object-cover animate-ken-burns" width={1920} height={1200} />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/30 to-cream/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/70 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-20 pt-40 w-full">
          <div className="max-w-2xl animate-fade-up">
            <div className="eyebrow text-coffee-deep mb-6">
              <span className="gold-rule" />
              Est. 2010 · Premium Land
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-coffee-deep leading-[1.05] tracking-tight">
              Invest in <em className="text-coffee italic">land</em>,<br />
              inherit a <em className="text-coffee italic">legacy</em>.
            </h1>
            <p className="mt-6 text-base lg:text-lg text-coffee max-w-lg leading-relaxed">
              Curated plots in India's most strategic corridors. Clear titles, gated communities, and the patient compounding only land can offer.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
              <EnquiryForm variant="compact" />
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.3em] uppercase text-coffee-deep border-b border-coffee-deep hover:text-gold hover:border-gold transition-colors"
              >
                View Projects <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl border-t border-coffee/20 pt-10">
            {[
              { k: "14", v: "Years Curating Land" },
              { k: "32", v: "Premium Projects" },
              { k: "2,400+", v: "Investors Served" },
              { k: "100%", v: "Clear Titles" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-serif text-3xl text-coffee-deep">{s.k}</div>
                <div className="eyebrow mt-1 text-coffee">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO QUOTE */}
      <section className="bg-sand py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="mx-auto text-gold" size={36} />
          <p className="mt-6 font-serif text-3xl lg:text-4xl text-coffee-deep leading-snug italic">
            "They don't make land anymore. We simply find the parcels worth keeping for a generation."
          </p>
          <div className="eyebrow mt-8 text-coffee">— A. Rao, Founding Partner</div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
            <div>
              <div className="eyebrow text-gold mb-4">Featured Projects</div>
              <h2 className="font-serif text-4xl lg:text-5xl text-coffee-deep max-w-2xl leading-tight">
                A portfolio of <em className="text-coffee">extraordinary</em> land.
              </h2>
            </div>
            <Link to="/projects" className="text-[11px] tracking-[0.3em] uppercase text-coffee-deep hover:text-gold transition flex items-center gap-2">
              View all projects <ArrowUpRight size={14} />
            </Link>
          </div>

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
                      to="/projects/$id"
                      params={{ id: p.id }}
                      className="text-[11px] tracking-[0.3em] uppercase text-coffee-deep hover:text-gold flex items-center gap-1.5"
                    >
                      Details <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="relative py-24 lg:py-32 bg-coffee-deep text-cream overflow-hidden">
        <img src={topo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen" loading="lazy" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="eyebrow text-gold mb-4">Why Terra Noble</div>
            <h2 className="font-serif text-4xl lg:text-5xl leading-tight">
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
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img src={topo} alt="Topographic map illustration" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 ring-1 ring-coffee-deep/10" />
          </div>
          <div>
            <div className="eyebrow text-gold mb-4">Land vs Apartments</div>
            <h2 className="font-serif text-4xl lg:text-5xl text-coffee-deep leading-tight">
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
      <section className="py-24 lg:py-32 bg-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="eyebrow text-gold mb-4">Locations</div>
            <h2 className="font-serif text-4xl lg:text-5xl text-coffee-deep">
              Strategically <em className="text-coffee">positioned</em>.
            </h2>
          </div>
          <div className="aspect-[16/8] w-full overflow-hidden shadow-soft border border-border">
            <iframe
              title="Project locations"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3889378.4!2d77.5!3d12.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <div className="eyebrow text-gold mb-4">In Their Words</div>
            <h2 className="font-serif text-4xl lg:text-5xl text-coffee-deep">
              The voices of <em className="text-coffee">our investors</em>.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { q: "Terra Noble made acquiring land feel like buying art — considered, transparent, and quietly powerful.", n: "Vikram S.", r: "Family Office, Bengaluru" },
              { q: "I have invested with three developers. Only one returned my calls a decade later. That speaks volumes.", n: "Priya M.", r: "NRI Investor, Singapore" },
              { q: "From documentation to handover, the experience was reminiscent of private banking.", n: "Dr. Anand R.", r: "Surgeon, Chennai" },
            ].map((t) => (
              <figure key={t.n} className="bg-sand p-8 border-t-2 border-gold">
                <Quote className="text-gold" size={22} />
                <blockquote className="font-serif text-xl text-coffee-deep mt-4 italic leading-snug">"{t.q}"</blockquote>
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
      <section id="enquire" className="py-24 lg:py-32 bg-coffee-deep relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-deep to-coffee" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-cream">
            <div className="eyebrow text-gold mb-4">Begin the Conversation</div>
            <h2 className="font-serif text-4xl lg:text-6xl leading-[1.05]">
              Land doesn't wait.<br /><em className="text-gold italic">Neither should you.</em>
            </h2>
            <p className="mt-6 text-cream/70 max-w-md leading-relaxed">
              Share your details and our investment advisor will reach out within one business hour. No pressure, no spam — only a quiet conversation about land.
            </p>
            <div className="mt-10 flex items-center gap-6">
              <div>
                <div className="eyebrow text-gold">Direct line</div>
                <div className="font-serif text-2xl text-cream mt-1">+91 98450 00000</div>
              </div>
            </div>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
