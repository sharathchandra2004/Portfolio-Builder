import type { Profile } from "@/lib/profile";
import { fontStack } from "@/lib/fonts";

const fontLinks = `
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600&family=IBM+Plex+Mono:wght@400;600&family=Instrument+Serif&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
`;

const designShell: Record<Profile["design"], string> = {
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

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function sectionBlock(profile: Profile, id: string, title: string, body: string): string {
  if (!profile.sections.includes(id)) return "";
  return `<section id="${id}" class="scroll-mt-8"><h2 class="mb-4 text-sm font-medium uppercase tracking-[0.2em] opacity-60">${title}</h2>${body}</section>`;
}

function renderSections(profile: Profile): string {
  const projects = profile.projects.filter((p) => p.title || p.description);
  const projectHtml =
    projects.length === 0
      ? ""
      : `<div class="grid gap-6 md:grid-cols-2">${projects
          .map(
            (project) => `<article class="rounded-2xl border border-current/10 p-5">
        ${project.image ? `<img src="${escapeHtml(project.image)}" alt="" class="mb-4 h-40 w-full rounded-xl object-cover" />` : ""}
        <h3 class="text-lg font-semibold">${escapeHtml(project.title || "Untitled project")}</h3>
        ${project.description ? `<p class="mt-2 text-sm leading-relaxed opacity-80">${escapeHtml(project.description)}</p>` : ""}
        ${project.technologies ? `<p class="mt-3 text-xs uppercase tracking-wide opacity-60">${escapeHtml(project.technologies)}</p>` : ""}
        ${project.url ? `<a href="${escapeHtml(project.url)}" class="mt-3 inline-block text-sm underline-offset-4 hover:underline">View project</a>` : ""}
      </article>`,
          )
          .join("")}</div>`;

  const contactLinks = [
    profile.email ? `<li><a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a></li>` : "",
    profile.linkedin ? `<li><a href="${escapeHtml(profile.linkedin)}">LinkedIn</a></li>` : "",
    profile.github ? `<li><a href="${escapeHtml(profile.github)}">GitHub</a></li>` : "",
  ]
    .filter(Boolean)
    .join("");

  const parts: string[] = [];
  for (const sectionId of profile.sections) {
    if (sectionId === "about") {
      parts.push(sectionBlock(profile, "about", "About", `<p class="max-w-3xl text-base leading-relaxed opacity-90">${escapeHtml(profile.intro)}</p>`));
    } else if (sectionId === "work") {
      parts.push(sectionBlock(profile, "work", "Selected work", projectHtml));
    } else if (sectionId === "skills") {
      parts.push(sectionBlock(profile, "skills", "Skills", `<p class="whitespace-pre-wrap leading-relaxed opacity-90">${escapeHtml(profile.skills)}</p>`));
    } else if (sectionId === "experience") {
      parts.push(sectionBlock(profile, "experience", "Experience", `<p class="whitespace-pre-wrap leading-relaxed opacity-90">${escapeHtml(profile.experience)}</p>`));
    } else if (sectionId === "education") {
      parts.push(sectionBlock(profile, "education", "Education", `<p class="whitespace-pre-wrap leading-relaxed opacity-90">${escapeHtml(profile.education)}</p>`));
    } else if (sectionId === "contact") {
      parts.push(
        sectionBlock(
          profile,
          "contact",
          "Contact",
          `<div class="rounded-2xl border border-current/15 bg-current/5 p-6"><ul class="flex flex-wrap gap-3">${contactLinks}</ul></div>`,
        ),
      );
    }
  }
  return parts.join("");
}

export function renderPortfolioDocument(profile: Profile): string {
  const accent = profile.accent;
  const font = fontStack(profile.font);
  const shell = designShell[profile.design];

  const body = `<div class="min-h-full ${shell}" style="--accent:${escapeHtml(accent)};font-family:${font}">
  <div class="mx-auto max-w-5xl px-6 py-12 md:py-16">
    <header class="mb-16 space-y-4">
      <h1 class="text-4xl font-semibold tracking-tight md:text-5xl">${escapeHtml(profile.name || "Your name")}</h1>
      <p class="text-lg opacity-80 md:text-xl">${escapeHtml(profile.title || "Your role or headline")}</p>
      ${profile.location ? `<p class="text-sm opacity-60">${escapeHtml(profile.location)}</p>` : ""}
    </header>
    <div class="space-y-14">${renderSections(profile)}</div>
    <footer class="mt-20 border-t border-current/10 pt-8 text-xs uppercase tracking-widest opacity-50">Built with folio</footer>
  </div>
</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${escapeHtml(profile.intro.slice(0, 160))}" />
  <title>${escapeHtml(profile.name || "Portfolio")}</title>
  ${fontLinks}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>:root { --accent: ${accent}; } body { font-family: ${font}; margin: 0; }</style>
</head>
<body>${body}</body>
</html>`;
}
