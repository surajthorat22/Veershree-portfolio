import { useState } from "react";
import { toast } from "sonner";

type Variant = "inline" | "card" | "compact";

export function EnquiryForm({ variant = "card", id }: { variant?: Variant; id?: string }) {
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const mobile = String(data.get("mobile") || "").trim();
    if (!/^\+?[0-9 ]{10,15}$/.test(mobile)) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    setSubmitting(true);
    // Persist to localStorage as a stand-in for backend
    const entry = {
      id: crypto.randomUUID(),
      name: String(data.get("name") || ""),
      mobile,
      location: String(data.get("location") || ""),
      message: String(data.get("message") || ""),
      createdAt: new Date().toISOString(),
    };
    const prev = JSON.parse(localStorage.getItem("tn_leads") || "[]");
    localStorage.setItem("tn_leads", JSON.stringify([entry, ...prev]));
    setTimeout(() => {
      setSubmitting(false);
      form.reset();
      toast.success("Thank you. Our advisor will call you shortly.");
    }, 600);
  }

  if (variant === "compact") {
    return (
      <form id={id} onSubmit={onSubmit} className="flex items-center gap-2 bg-card p-2 rounded-full shadow-soft border border-border max-w-md w-full">
        <input
          name="mobile"
          required
          placeholder="Your mobile number"
          className="flex-1 px-4 py-2 bg-transparent text-sm outline-none text-coffee-deep placeholder:text-coffee/50"
        />
        <button
          disabled={submitting}
          className="bg-coffee-deep text-cream px-5 py-2.5 rounded-full text-[11px] tracking-[0.3em] uppercase hover:bg-coffee transition disabled:opacity-60"
        >
          {submitting ? "..." : "Enquire"}
        </button>
      </form>
    );
  }

  if (variant === "inline") {
    return (
      <form id={id} onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-3">
        <input name="name" required placeholder="Your name" className="px-4 py-3 bg-cream border border-border text-sm outline-none focus:border-gold" />
        <input name="mobile" required placeholder="Mobile number" className="px-4 py-3 bg-cream border border-border text-sm outline-none focus:border-gold" />
        <input name="location" placeholder="Preferred location" className="sm:col-span-2 px-4 py-3 bg-cream border border-border text-sm outline-none focus:border-gold" />
        <button disabled={submitting} className="sm:col-span-2 bg-coffee-deep text-cream px-6 py-3 text-xs tracking-[0.3em] uppercase hover:bg-coffee transition disabled:opacity-60">
          {submitting ? "Sending..." : "Get a Callback"}
        </button>
      </form>
    );
  }

  return (
    <form id={id} onSubmit={onSubmit} className="bg-card p-8 lg:p-10 shadow-soft border border-border">
      <div className="eyebrow text-gold mb-3">Schedule a private call</div>
      <h3 className="font-serif text-3xl text-coffee-deep mb-6 leading-tight">
        Let our investment <em className="text-coffee">advisor</em> reach out.
      </h3>
      <div className="grid gap-3">
        <input name="name" required placeholder="Full name" className="px-4 py-3 bg-cream border border-border text-sm outline-none focus:border-gold" />
        <input name="mobile" required placeholder="Mobile number" className="px-4 py-3 bg-cream border border-border text-sm outline-none focus:border-gold" />
        <input name="location" placeholder="Preferred location (e.g. Bengaluru)" className="px-4 py-3 bg-cream border border-border text-sm outline-none focus:border-gold" />
        <textarea name="message" rows={3} placeholder="Tell us what you're looking for (optional)" className="px-4 py-3 bg-cream border border-border text-sm outline-none focus:border-gold resize-none" />
        <button disabled={submitting} className="bg-coffee-deep text-cream px-6 py-4 text-xs tracking-[0.35em] uppercase hover:bg-coffee transition disabled:opacity-60 mt-2">
          {submitting ? "Sending..." : "Request a Callback"}
        </button>
        <p className="text-[11px] text-coffee/60 mt-2">By submitting you agree to be contacted by our team. Your details remain confidential.</p>
      </div>
    </form>
  );
}
