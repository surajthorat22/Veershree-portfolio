import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import type { Project, ProjectStatus, UpsertProject } from "@Veershree-portfolio/api/index";
import { Plus, Pencil, Trash2, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { QueryEmpty } from "@/components/site/QueryFeedback";
import { getErrorMessage } from "@/utils/api-error";
import { fetchProjects } from "@/utils/api";
import { formatPriceFrom } from "@/utils/format-price";
import { uploadImage } from "@/utils/upload";
import { adminHeaders, apiClient } from "@/utils/ts-rest";

export const Route = createFileRoute("/admin/projects")({
  loader: () => fetchProjects(),
  component: ProjectsAdmin,
});

function ProjectsAdmin() {
  const router = useRouter();
  const projects = Route.useLoaderData();
  const [editing, setEditing] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  async function onDelete(slug: string) {
    if (!confirm("Delete this project?")) return;
    setDeletingSlug(slug);
    const response = await apiClient.deleteProject({ params: { slug }, extraHeaders: adminHeaders() });
    setDeletingSlug(null);
    if (response.status !== 200) {
      toast.error(getErrorMessage(response.body));
      return;
    }
    toast.success("Project removed");
    router.invalidate();
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

      {projects.length === 0 ? (
        <QueryEmpty title="No projects yet" description="Add your first project to get started." />
      ) : (
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
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-cream/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.image && <img src={p.image} alt="" className="w-12 h-12 object-cover" />}
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
                    <button
                      onClick={() => onDelete(p.slug)}
                      disabled={deletingSlug === p.slug}
                      className="p-2 text-coffee hover:text-destructive disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <ProjectModal
          initial={editing}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSaved={() => {
            setOpen(false);
            setEditing(null);
            router.invalidate();
          }}
        />
      )}
    </div>
  );
}

type ProjectFormState = {
  slug: string;
  name: string;
  location: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  priceFrom: string;
  size: string;
  status: ProjectStatus;
};

function emptyForm(): ProjectFormState {
  return {
    slug: "",
    name: "",
    location: "",
    tagline: "",
    description: "",
    features: [],
    image: "",
    priceFrom: "",
    size: "",
    status: "Open",
  };
}

function projectToForm(project: Project): ProjectFormState {
  return {
    slug: project.slug,
    name: project.name,
    location: project.location,
    tagline: project.tagline,
    description: project.description,
    features: project.features,
    image: project.image,
    priceFrom: project.priceFrom,
    size: project.size,
    status: project.status,
  };
}

function formToBody(form: ProjectFormState): UpsertProject {
  return {
    slug: form.slug || undefined,
    name: form.name,
    location: form.location,
    tagline: form.tagline || undefined,
    description: form.description || undefined,
    features: form.features,
    image: form.image || undefined,
    priceFrom: form.priceFrom || undefined,
    size: form.size || undefined,
    status: form.status,
  };
}

function ProjectModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProjectFormState>(initial ? projectToForm(initial) : emptyForm());
  const [featuresStr, setFeaturesStr] = useState((initial?.features || []).join(", "));
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  function clearImage() {
    setForm((f) => ({ ...f, image: "" }));
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, image: preview }));
    setUploadingImage(true);

    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
      toast.success("Image uploaded");
    } catch (err) {
      setForm((f) => ({ ...f, image: "" }));
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      URL.revokeObjectURL(preview);
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  function handlePriceChange(value: string) {
    setForm({ ...form, priceFrom: formatPriceFrom(value) });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) {
      toast.error("Name and location are required");
      return;
    }
    if (uploadingImage) {
      toast.error("Please wait for the image upload to finish");
      return;
    }
    if (form.image.startsWith("blob:")) {
      toast.error("Image is still uploading");
      return;
    }

    const body = formToBody({
      ...form,
      features: featuresStr.split(",").map((s) => s.trim()).filter(Boolean),
    });

    setSaving(true);
    const response = initial
      ? await apiClient.updateProject({ params: { slug: initial.slug }, body, extraHeaders: adminHeaders() })
      : await apiClient.createProject({ body, extraHeaders: adminHeaders() });
    setSaving(false);

    if (response.status !== 200 && response.status !== 201) {
      toast.error(getErrorMessage("Project update failed"));
      return;
    }

    toast.success(initial ? "Project updated" : "Project added");
    onSaved();
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
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })} className={inp}>
                <option>Open</option><option>Few Left</option><option>Sold Out</option>
              </select>
            </Field>
          </div>
          <Field label="Slug (optional)"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from name" className={inp} /></Field>
          <Field label="Tagline"><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inp} /></Field>
          <Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp + " resize-none"} /></Field>
          <Field label="Features (comma separated)"><input value={featuresStr} onChange={(e) => setFeaturesStr(e.target.value)} className={inp} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price From">
              <input
                value={form.priceFrom}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="₹ 78 L"
                className={inp}
              />
            </Field>
            <Field label="Plot Size"><input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="1,200 – 3,600 sq ft" className={inp} /></Field>
          </div>
          <Field label="Image URL or upload">
            <div className="relative">
              <input
                value={form.image.startsWith("blob:") ? "" : form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className={inp + " pr-10 mb-2"}
              />
              {form.image && !form.image.startsWith("blob:") && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute right-2 top-2.5 text-coffee hover:text-destructive"
                  aria-label="Clear image URL"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImage} disabled={uploadingImage} className="text-sm text-coffee disabled:opacity-50" />
            {uploadingImage && <p className="text-xs text-coffee mt-2">Uploading image...</p>}
            {form.image && (
              <div className="relative inline-block mt-3">
                <img src={form.image} alt="" className="w-32 h-24 object-cover border border-border" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-coffee-deep text-cream rounded-full p-1 hover:bg-destructive transition"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </Field>
        </div>
        <div className="px-8 py-5 border-t border-border flex justify-end gap-3 bg-sand">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-[11px] tracking-[0.3em] uppercase text-coffee">Cancel</button>
          <button type="submit" disabled={saving} className="bg-coffee-deep text-cream px-6 py-2.5 text-[11px] tracking-[0.3em] uppercase hover:bg-coffee disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </button>
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
