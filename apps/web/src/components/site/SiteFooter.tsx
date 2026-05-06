import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-coffee-deep text-cream/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-serif text-3xl text-cream">Veershree</span>
            <span className="text-gold">·</span>
            <span className="font-serif text-3xl text-cream">Realty</span>
          </div>
          <p className="text-sm leading-relaxed max-w-md text-cream/60">
            Curating premium land parcels across India's most strategic growth corridors since 2010.
            Clear titles, considered design, generational value.
          </p>
        </div>

        <div>
          <div className="eyebrow text-gold mb-5">Explore</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/projects" className="hover:text-gold transition">Projects</Link></li>
            <li><Link to="/why-land" className="hover:text-gold transition">Why Land</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition">Contact</Link></li>
            <li><Link to="/admin" className="hover:text-gold transition">Admin</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-gold mb-5">Reach Us</div>
          <ul className="space-y-3 text-sm">
            <li>+91 98450 00000</li>
            <li>hello@veershreerealty.in</li>
            <li>UB City, Bengaluru</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between gap-3 text-[11px] tracking-widest uppercase text-cream/50">
          <div>© {new Date().getFullYear()} Veershree Realty</div>
          <div>Crafted for those who plant legacies.</div>
        </div>
      </div>
    </footer>
  );
}
