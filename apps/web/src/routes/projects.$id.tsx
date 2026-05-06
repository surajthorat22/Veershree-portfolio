import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { projects } from "@/data/projects";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { ArrowLeft, MapPin } from "lucide-react";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.id === params.id);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.name} — Veershree Realty` },
          { name: "description", content: loaderData.project.tagline },
          { property: "og:title", content: `${loaderData.project.name} — ${loaderData.project.location}` },
          { property: "og:description", content: loaderData.project.tagline },
          { property: "og:image", content: loaderData.project.image },
          { name: "twitter:image", content: loaderData.project.image },
        ]
      : [],
  }),
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-5xl text-coffee-deep">Project not found</h1>
        <Link to="/projects" className="mt-6 inline-block text-coffee underline">Back to projects</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <p>{error.message}</p>
    </div>
  ),
});

function ProjectDetail() {
  const { project } = Route.useLoaderData();

  return (
    <>
      <section className="relative h-[80vh] min-h-[500px] flex items-end overflow-hidden">
        <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover animate-ken-burns" width={1600} height={1000} />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-deep/80 via-coffee-deep/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full text-cream">
          <Link to="/projects" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase mb-6 hover:text-gold">
            <ArrowLeft size={14} /> All Projects
          </Link>
          <div className="eyebrow text-gold mb-3 flex items-center gap-2"><MapPin size={12} /> {project.location}</div>
          <h1 className="font-serif text-5xl lg:text-7xl leading-tight max-w-3xl">{project.name}</h1>
          <p className="mt-4 text-cream/80 max-w-2xl">{project.tagline}</p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="eyebrow text-gold mb-3">Overview</div>
            <p className="font-serif text-2xl text-coffee-deep leading-snug">{project.description}</p>

            <h3 className="font-serif text-3xl text-coffee-deep mt-16 mb-6">Key Features</h3>
            <ul className="grid sm:grid-cols-2 gap-4">
              {project.features.map((f) => (
                <li key={f} className="border-t border-border pt-4 text-coffee-deep flex gap-3">
                  <span className="text-gold">·</span> {f}
                </li>
              ))}
            </ul>

            <h3 className="font-serif text-3xl text-coffee-deep mt-16 mb-6">Location</h3>
            <div className="aspect-[16/9] overflow-hidden border border-border">
              <iframe
                title="Map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(project.location)}&output=embed`}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 self-start space-y-6">
            <div className="bg-sand p-6 border-t-2 border-gold">
              <div className="eyebrow">From</div>
              <div className="font-serif text-3xl text-coffee-deep mt-1">{project.priceFrom}</div>
              <div className="mt-4 eyebrow">Plot sizes</div>
              <div className="font-serif text-lg text-coffee-deep mt-1">{project.size}</div>
              <div className="mt-4 eyebrow">Status</div>
              <div className="font-serif text-lg text-coffee-deep mt-1">{project.status}</div>
            </div>
            <EnquiryForm />
          </aside>
        </div>
      </section>
    </>
  );
}
