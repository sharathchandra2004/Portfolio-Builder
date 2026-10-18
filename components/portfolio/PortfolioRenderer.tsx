import type { Profile } from "@/lib/profile";
import { fontStack } from "@/lib/fonts";
import type { SectionId } from "@/lib/sections";

type Props = { profile: Profile; preview?: boolean };

function LinkList({ profile }: { profile: Profile }) {
  const links = [
    profile.email ? { label: profile.email, href: `mailto:${profile.email}` } : null,
    profile.linkedin ? { label: "LinkedIn", href: profile.linkedin } : null,
    profile.github ? { label: "GitHub", href: profile.github } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  if (!links.length) return <p className="opacity-60">Add contact links in the editor.</p>;

  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} className="underline-offset-4 hover:underline">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Projects({ profile, compact }: { profile: Profile; compact?: boolean }) {
  const items = profile.projects.filter((p) => p.title || p.description);
  if (!items.length) return <p className="opacity-60">Add a project to showcase your work.</p>;

  return (
    <div className={compact ? "space-y-4" : "grid gap-6 md:grid-cols-2"}>
      {items.map((project, index) => (
        <article key={`${project.title}-${index}`} className="rounded-2xl border border-current/10 p-5">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.image} alt="" className="mb-4 h-40 w-full rounded-xl object-cover" />
          ) : null}
          <h3 className="text-lg font-semibold">{project.title || "Untitled project"}</h3>
          {project.description ? <p className="mt-2 text-sm leading-relaxed opacity-80">{project.description}</p> : null}
          {project.technologies ? <p className="mt-3 text-xs uppercase tracking-wide opacity-60">{project.technologies}</p> : null}
          {project.url ? (
            <a href={project.url} className="mt-3 inline-block text-sm underline-offset-4 hover:underline">
              View project
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function SectionBlock({
  id,
  title,
  profile,
  children,
}: {
  id: SectionId;
  title: string;
  profile: Profile;
  children: React.ReactNode;
}) {
  if (!profile.sections.includes(id)) return null;
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] opacity-60">{title}</h2>
      {children}
    </section>
  );
}

export function PortfolioRenderer({ profile, preview }: Props) {
  const style = {
    ["--accent" as string]: profile.accent,
    fontFamily: fontStack(profile.font),
  } as React.CSSProperties;

  const shell = `min-h-full ${preview ? "text-[13px]" : ""}`;
  const designs: Record<Profile["design"], string> = {
    editorial: "bg-[#f7f5f0] text-neutral-900",
    gallery: "bg-neutral-950 text-neutral-100",
    bold: "bg-[#ffe03d] text-black",
    minimal: "bg-white text-slate-900",
    terminal: "bg-[#0b1220] text-emerald-300 font-mono",
    product: "bg-slate-50 text-slate-900",
    classic: "bg-white text-neutral-800",
    brand: "bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white",
    story: "bg-[#fff7ed] text-stone-900",
  };

  const heroTitle =
    profile.design === "bold" ? (
      <h1 className="text-5xl font-black uppercase leading-none md:text-7xl">{profile.name || "Your name"}</h1>
    ) : profile.design === "terminal" ? (
      <h1 className="text-3xl md:text-4xl">{`> ${profile.name || "your.name"}`}</h1>
    ) : profile.design === "brand" ? (
      <h1 className="font-display text-5xl md:text-6xl">{profile.name || "Your name"}</h1>
    ) : (
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{profile.name || "Your name"}</h1>
    );

  return (
    <div className={`${shell} ${designs[profile.design]}`} style={style}>
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <header className="mb-16 space-y-4">
          {heroTitle}
          <p className="text-lg opacity-80 md:text-xl">{profile.title || "Your role or headline"}</p>
          {profile.location ? <p className="text-sm opacity-60">{profile.location}</p> : null}
          <nav aria-label="Sections" className="flex flex-wrap gap-4 pt-4 text-sm">
            {profile.sections.map((section) => (
              <a key={section} href={`#${section}`} className="rounded-full px-3 py-1 hover:bg-current/10">
                {section}
              </a>
            ))}
          </nav>
        </header>

        <div className="space-y-14">
          {profile.sections.map((sectionId) => {
            if (sectionId === "about") {
              return (
                <SectionBlock key={sectionId} id="about" title="About" profile={profile}>
                  <p className="max-w-3xl text-base leading-relaxed opacity-90">{profile.intro || "Tell visitors who you are and what you care about."}</p>
                </SectionBlock>
              );
            }
            if (sectionId === "work") {
              return (
                <SectionBlock key={sectionId} id="work" title="Selected work" profile={profile}>
                  <Projects profile={profile} compact={profile.design === "gallery"} />
                </SectionBlock>
              );
            }
            if (sectionId === "skills") {
              return (
                <SectionBlock key={sectionId} id="skills" title="Skills" profile={profile}>
                  <p className="max-w-2xl whitespace-pre-wrap leading-relaxed opacity-90">{profile.skills || "List tools, crafts, or strengths."}</p>
                </SectionBlock>
              );
            }
            if (sectionId === "experience") {
              return (
                <SectionBlock key={sectionId} id="experience" title="Experience" profile={profile}>
                  <p className="max-w-3xl whitespace-pre-wrap leading-relaxed opacity-90">{profile.experience || "Share roles, impact, and highlights."}</p>
                </SectionBlock>
              );
            }
            if (sectionId === "education") {
              return (
                <SectionBlock key={sectionId} id="education" title="Education" profile={profile}>
                  <p className="max-w-2xl whitespace-pre-wrap leading-relaxed opacity-90">{profile.education || "Degrees, programs, or certifications."}</p>
                </SectionBlock>
              );
            }
            if (sectionId === "contact") {
              return (
                <SectionBlock key={sectionId} id="contact" title="Contact" profile={profile}>
                  <div className="rounded-2xl border border-current/15 bg-current/5 p-6">
                    <LinkList profile={profile} />
                  </div>
                </SectionBlock>
              );
            }
            return null;
          })}
        </div>

        <footer className="mt-20 border-t border-current/10 pt-8 text-xs uppercase tracking-widest opacity-50">
          Built with folio
        </footer>
      </div>
    </div>
  );
}
