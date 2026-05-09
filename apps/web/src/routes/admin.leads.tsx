import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

type Lead = {
  id: string;
  name: string;
  mobile: string;
  location: string;
  message: string;
  createdAt: string;
};

export const Route = createFileRoute("/admin/leads")({
  component: LeadsAdmin,
});

function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(JSON.parse(localStorage.getItem("tn_leads") || "[]"));
  }, []);

  function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    const next = leads.filter((l) => l.id !== id);
    setLeads(next);
    localStorage.setItem("tn_leads", JSON.stringify(next));
  }

  function exportCSV() {
    if (leads.length === 0) { toast.error("No enquiries to export"); return; }
    const header = "Name,Mobile,Location,Message,Date";
    const rows = leads.map((l) =>
      [l.name, l.mobile, l.location, l.message, l.createdAt].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `veershree-realty-leads-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="eyebrow text-gold mb-2">Inbox</div>
          <h1 className="font-serif text-4xl text-coffee-deep">Enquiries</h1>
          <p className="text-coffee mt-2">{leads.length} {leads.length === 1 ? "enquiry" : "enquiries"} captured</p>
        </div>
        <button onClick={exportCSV} className="border border-coffee-deep text-coffee-deep px-5 py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-coffee-deep hover:text-cream transition flex items-center gap-2">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="bg-card border border-border p-16 text-center">
          <Mail className="mx-auto text-gold mb-4" size={32} strokeWidth={1.2} />
          <h3 className="font-serif text-2xl text-coffee-deep">No enquiries yet</h3>
          <p className="text-coffee mt-2 text-sm">When visitors submit the form, they'll appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map((l) => (
            <div key={l.id} className="bg-card border border-border p-6 grid md:grid-cols-[1fr_auto] gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-serif text-2xl text-coffee-deep">{l.name || "Anonymous"}</h3>
                  <span className="eyebrow text-coffee/60">{new Date(l.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-5 text-sm text-coffee">
                  <a href={`tel:${l.mobile}`} className="flex items-center gap-2 hover:text-gold"><Phone size={14} /> {l.mobile}</a>
                  {l.location && <span>📍 {l.location}</span>}
                </div>
                {l.message && <p className="mt-3 text-sm text-coffee italic">"{l.message}"</p>}
              </div>
              <div className="flex md:flex-col gap-2 justify-end">
                <a href={`https://wa.me/${l.mobile.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-coffee-deep text-cream text-[10px] tracking-[0.3em] uppercase hover:bg-coffee">WhatsApp</a>
                <button onClick={() => remove(l.id)} className="p-2 text-coffee hover:text-destructive self-end"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
