import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { projects as seed, type Project } from "@/data/projects";
import { Plus, Pencil, Trash2, X, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  component: ProjectsAdmin,
});

const STORAGE_KEY = "tn_projects";

function loadProjects(): Project[] {
  if (typeof window === "undefined") return seed;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return seed;
  try { return JSON.parse(stored); } catch { return seed; }
}

function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { setItems(loadProjects()); }, []);

  function persist(next: Project[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function onSave(p: Project) {
    const exists = items.some((x) => x.id === p.id);
    const next = exists ? items.map((x) => (x.id === p.id ? p : x)) : [p, ...items];
    persist(next);
    setOpen(false);
    setEditing(null);
    toast.success(exists ? "Project updated" : "Project added");
  }

  function onDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    persist(items.filter((p) => p.id !== id));
    toast.success("Project removed");
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="eyebrow text-gold mb-2">Manage</div>
          <h1 className="font-serif text-4xl text-coffee-deep">Projects</h1>
        </div>
        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="bg-coffee-deep text-cream px-5 py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-coffee transition flex items-center gap-2"
        >
          <Plus size={14} /> New Project
        </button>
      </div>

      <div className="bg-card border border-border">
        <table className="w-full text-sm">
          <thead className="bg-sand text-coffee-deep">
            <tr className="text-left">
              <th className="px-5 py-4 eyebrow">Project</th>
              <th className="px-5 py-4 eyebrow">Location</th>
              <th className="px-5 py-4 eyebrow">From</th>
              <th className="px-5 py-4 eyebrow">Status</th>
              <th className="px-5 py-4 eyebrow text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-cream/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-12 h-12 object-cover" />
                    <div>
                      <div className="font-serif text-lg text-coffee-deep">{p.name}</div>
                      <div className="text-xs text-coffee/70">{p.tagline}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-coffee">
                  <span className="inline-flex items-center gap-1"><MapPin size={12} /> {p.location}</span>
                </td>
                <td className="px-5 py-4 font-serif text-coffee-deep">{p.priceFrom}</td>
                <td className="px-5 py-4"><span className="text-xs px-2 py-1 bg-sand">{p.status}</span></td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => { setEditing(p); setOpen(true); }} className="p-2 text-coffee hover:text-gold"><Pencil size={15} /></button>
                  <button onClick={() => onDelete(p.id)} className="p-2 text-coffee hover:text-destructive"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-coffee/60">No projects yet. Add your first.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && <ProjectModal initial={editing} onSave={onSave} onClose={() => { setOpen(false); setEditing(null); }} />}
    </div>
  );
}

function ProjectModal({ initial, onSave, onClose }: { initial: Project | null; onSave: (p: Project) => void; onClose: () => void }) {
  const [form, setForm] = useState<Project>(
    initial ?? {
      id: "",
      name: "",
      location: "",
      tagline: "",
      description: "",
      features: [],
      image: "",
      priceFrom: "",
      size: "",
      status: "Open",
    }
  );
  const [featuresStr, setFeaturesStr] = useState((initial?.features || []).join(", "));

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.location) { toast.error("Name and location are required"); return; }
    const id = form.id || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    onSave({ ...form, id, features: featuresStr.split(",").map((s) => s.trim()).filter(Boolean) });
  }

  return (
    <div className="fixed inset-0 z-50 bg-coffee-deep/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
      <form onSubmit={submit} className="bg-card max-w-2xl w-full max-h-[90vh] overflow-auto shadow-soft">
        <div className="px-8 py-5 border-b border-border flex justify-between items-center sticky top-0 bg-card">
          <h2 className="font-serif text-2xl text-coffee-deep">{initial ? "Edit Project" : "New Project"}</h2>
          <button type="button" onClick={onClose} className="text-coffee hover:text-coffee-deep"><X size={20} /></button>
        </div>
        <div className="p-8 grid gap-4">
          <Field label="Project Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location"><input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inp} /></Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })} className={inp}>
                <option>Open</option><option>Few Left</option><option>Sold Out</option>
              </select>
            </Field>
          </div>
          <Field label="Tagline"><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inp} /></Field>
          <Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp + " resize-none"} /></Field>
          <Field label="Features (comma separated)"><input value={featuresStr} onChange={(e) => setFeaturesStr(e.target.value)} className={inp} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price From"><input value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} placeholder="₹ 78 L" className={inp} /></Field>
            <Field label="Plot Size"><input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="1,200 – 3,600 sq ft" className={inp} /></Field>
          </div>
          <Field label="Image">
            <input type="file" accept="image/*" onChange={handleImage} className="text-sm text-coffee" />
            {form.image && <img src={form.image} alt="" className="mt-3 w-32 h-24 object-cover border border-border" />}
          </Field>
        </div>
        <div className="px-8 py-5 border-t border-border flex justify-end gap-3 bg-sand">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-[11px] tracking-[0.3em] uppercase text-coffee">Cancel</button>
          <button type="submit" className="bg-coffee-deep text-cream px-6 py-2.5 text-[11px] tracking-[0.3em] uppercase hover:bg-coffee">Save</button>
        </div>
      </form>
    </div>
  );
}

const inp = "w-full px-3 py-2.5 bg-cream border border-border text-sm text-coffee-deep outline-none focus:border-gold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2">{label}</span>
      {children}
    </label>
  );
}
