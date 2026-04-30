import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Terra Noble" },
      { name: "description", content: "Speak with our investment advisors. Visit our Bengaluru studio or reach us by phone." },
      { property: "og:title", content: "Contact Terra Noble" },
      { property: "og:description", content: "Quiet, considered conversations about land." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="pt-40 pb-12 bg-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="eyebrow text-gold mb-4">Get in Touch</div>
          <h1 className="font-serif text-5xl lg:text-7xl text-coffee-deep leading-tight">
            A quiet conversation,<br /><em className="text-coffee">on your terms</em>.
          </h1>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {[
              { Icon: Phone, t: "Direct Line", d: "+91 98450 00000", href: "tel:+919845000000" },
              { Icon: MessageCircle, t: "WhatsApp", d: "Chat with an advisor", href: "https://wa.me/919845000000" },
              { Icon: Mail, t: "Email", d: "hello@terranoble.in", href: "mailto:hello@terranoble.in" },
              { Icon: MapPin, t: "The Studio", d: "12th Floor, UB City, Bengaluru 560001", href: "#map" },
            ].map(({ Icon, t, d, href }) => (
              <a key={t} href={href} className="flex gap-5 group border-t border-border pt-6">
                <Icon className="text-gold mt-1" size={22} strokeWidth={1.4} />
                <div>
                  <div className="eyebrow">{t}</div>
                  <div className="font-serif text-2xl text-coffee-deep mt-1 group-hover:text-coffee">{d}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="lg:col-span-3">
            <EnquiryForm />
          </div>
        </div>
      </section>

      <section id="map" className="pb-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="aspect-[16/8] w-full overflow-hidden shadow-soft border border-border">
            <iframe
              title="Studio location"
              src="https://www.google.com/maps?q=UB+City+Bengaluru&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
