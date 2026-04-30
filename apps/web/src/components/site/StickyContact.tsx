import { Phone, MessageCircle } from "lucide-react";

export function StickyContact() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href="https://wa.me/919845000000?text=Hi%2C%20I%27m%20interested%20in%20your%20plots"
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle size={20} />
      </a>
      <a
        href="tel:+919845000000"
        className="w-12 h-12 rounded-full bg-coffee-deep text-cream flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
        aria-label="Call"
      >
        <Phone size={18} />
      </a>
    </div>
  );
}
