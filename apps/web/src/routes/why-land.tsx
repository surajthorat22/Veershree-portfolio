import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import topo from "@/assets/topo-pattern.jpg";

export const Route = createFileRoute("/why-land")({
  head: () => ({
    meta: [
      { title: "Why Land — Terra Noble" },
      { name: "description", content: "Why land remains the most enduring asset class — and why the wealthy quietly accumulate it." },
      { property: "og:title", content: "Why Land — The Discipline of Real Wealth" },
      { property: "og:description", content: "Apartments depreciate. Land doesn't." },
    ],
  }),
  component: WhyLand,
});

function WhyLand() {
  return (
    <>
      <section className="pt-40 pb-20 bg-sand relative overflow-hidden">
        <img src={topo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" loading="lazy" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <div className="eyebrow text-gold mb-4">A Quiet Manifesto</div>
          <h1 className="font-serif text-5xl lg:text-7xl text-coffee-deep leading-tight">
            They don't make<br /><em className="text-coffee">land</em> anymore.
          </h1>
          <p className="mt-8 text-coffee max-w-2xl mx-auto leading-relaxed text-lg">
            Every other asset is engineered. Land alone is finite. That single fact has built — and preserved — most of the world's quiet fortunes.
          </p>
        </div>
      </section>

      <section className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 space-y-20">
          {[
            { n: "01", t: "Scarcity, by definition", d: "You can build another tower. You cannot build another acre. As cities expand, the gravity of finite ground only grows stronger." },
            { n: "02", t: "Compounding patience", d: "Land rewards the patient. While apartments depreciate from day one, well-chosen plots have historically appreciated 15–22% CAGR in growth corridors." },
            { n: "03", t: "Optionality", d: "Hold it. Build on it. Lease it. Pass it on. Land is the rare asset that never closes a single door." },
            { n: "04", t: "A legacy you can stand on", d: "Generations from now, your name will still be on the deed. Few investments offer that kind of permanence." },
          ].map((s) => (
            <div key={s.n} className="grid md:grid-cols-[120px_1fr] gap-8 border-t border-border pt-10">
              <div className="font-serif text-5xl text-gold">{s.n}</div>
              <div>
                <h2 className="font-serif text-3xl text-coffee-deep">{s.t}</h2>
                <p className="mt-4 text-coffee leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="enquire" className="py-24 bg-coffee-deep">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-cream">
            <div className="eyebrow text-gold mb-4">Speak with an Advisor</div>
            <h2 className="font-serif text-4xl lg:text-5xl">A conversation, not a pitch.</h2>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
