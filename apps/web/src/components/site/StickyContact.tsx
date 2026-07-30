import { Phone, MessageCircle } from "lucide-react";

export function StickyContact() {
  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col gap-2.5 sm:gap-3">
      <a
        href="https://wa.me/917875581414?text=Hi%2C%20I%27m%20interested%20in%20your%20plots"
        target="_blank"
        rel="noreferrer"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle size={18} className="sm:hidden" />
        <MessageCircle size={20} className="hidden sm:block" />
      </a>
      <a
        href="tel:+917875581414"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-coffee-deep text-cream flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
        aria-label="Call"
      >
        <Phone size={16} className="sm:hidden" />
        <Phone size={18} className="hidden sm:block" />
      </a>
    </div>
  );
}
