import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { JsonLd } from "@/components/site/JsonLd";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { breadcrumbJsonLd, buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildPageHead({
      title: "Contact",
      description:
        "Contact Veershree Realty in Chakan, Pune. Call +91 78755 81414 or email info@veershreerealty.com for land investment advice.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
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
              { Icon: Phone, t: "Direct Line", d: "+91 78755 81414", href: "tel:+917875581414" },
              { Icon: MessageCircle, t: "WhatsApp", d: "Chat with an advisor", href: "https://wa.me/917875581414" },
              { Icon: Mail, t: "Email", d: "info@veershreerealty.com", href: "mailto:info@veershreerealty.com" },
              { Icon: MapPin, t: "The Office", d: "Chakan, Pune, Maharashtra 410501", href: "#map" },
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
              title="Office location"
              src="https://www.google.com/maps?q=chakan+pune+maharashtra&output=embed&z=13"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
