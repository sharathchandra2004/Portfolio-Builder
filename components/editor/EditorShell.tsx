"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clearDraft, loadDraft, saveDraft } from "@/lib/draft";
import { downloadBlob } from "@/lib/download";
import { fontOptions } from "@/lib/fonts";
import { mergeProfile } from "@/lib/merge-profile";
import { allSections, sectionMeta, type SectionId } from "@/lib/sections";
import { categoryLabels, designs, emptyProfile, type Design, type Profile } from "@/lib/profile";

type PreviewMode = "desktop" | "mobile";

export function EditorShell() {
  const [profile, setProfile] = useState<Profile>(() => emptyProfile());
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState<PreviewMode>("desktop");
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    loadDraft().then((draft) => {
      setProfile(draft ?? emptyProfile());
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => {
      void saveDraft(profile);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [profile, ready]);

  const categoryDesigns = useMemo(() => designs[profile.category], [profile.category]);

  function update(patch: Partial<Profile>) {
    setProfile((current) => mergeProfile(current, patch));
  }

  function toggleSection(section: SectionId) {
    const sections = profile.sections.includes(section)
      ? profile.sections.filter((s) => s !== section)
      : [...profile.sections, section];
    update({ sections });
  }

  function moveSection(section: SectionId, direction: -1 | 1) {
    const sections = [...profile.sections];
    const index = sections.indexOf(section);
    if (index < 0) return;
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    update({ sections });
  }

  function updateProject(index: number, field: keyof Profile["projects"][number], value: string) {
    const projects = profile.projects.map((project, i) => (i === index ? { ...project, [field]: value } : project));
    update({ projects });
  }

  function addProject() {
    update({ projects: [...profile.projects, { title: "", description: "", technologies: "", url: "", image: "" }] });
  }

  async function exportZip() {
    setExporting(true);
    setStatus(null);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Export failed.");
      }
      const blob = await response.blob();
      const filename =
        response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ??
        `${profile.name || "portfolio"}-site.zip`;
      downloadBlob(blob, filename);
      setStatus("ZIP downloaded — extract and follow README for deployment.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  if (!ready) {
    return <p className="p-10 text-sm text-ink-muted">Loading your draft…</p>;
  }

  return (
    <div className="min-h-screen bg-paper-dim">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">
              folio
            </Link>
            <span className="text-xs text-ink-muted">Auto-saved in this browser</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => void clearDraft().then(() => setProfile(emptyProfile()))}>
              Reset draft
            </Button>
            <Button onClick={() => void exportZip()} disabled={exporting}>
              {exporting ? "Packaging…" : "Download ZIP"}
            </Button>
          </div>
        </div>
        {status ? <p className="border-t border-ink/5 px-4 py-2 text-center text-xs text-ink-muted">{status}</p> : null}
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[420px_1fr]">
        <aside className="space-y-6 pb-10 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:pr-2">
          <Panel title="Basics">
            <Field label="Name" value={profile.name} onChange={(value) => update({ name: value })} />
            <Field label="Headline" value={profile.title} onChange={(value) => update({ title: value })} />
            <Area label="Intro" value={profile.intro} onChange={(value) => update({ intro: value })} />
            <Field label="Location" value={profile.location} onChange={(value) => update({ location: value })} />
          </Panel>

          <Panel title="Category & design">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(categoryLabels) as Profile["category"][]).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => update({ category, design: designs[category][0].id })}
                  className={`rounded-xl border px-2 py-2 text-xs ${profile.category === category ? "border-ink bg-ink text-paper" : "border-ink/10 bg-white"}`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {categoryDesigns.map((design) => (
                <button
                  key={design.id}
                  type="button"
                  onClick={() => update({ design: design.id as Design })}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ${profile.design === design.id ? "border-ink bg-white shadow-soft" : "border-ink/10 bg-white/70"}`}
                >
                  <span>{design.name}</span>
                  <span className="text-xs text-ink-muted">{design.number}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Theme">
            <Label htmlFor="accent">Accent</Label>
            <div className="flex items-center gap-3">
              <input
                id="accent"
                type="color"
                value={profile.accent}
                onChange={(e) => update({ accent: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded-lg border border-ink/10 bg-white"
              />
              <Input value={profile.accent} onChange={(e) => update({ accent: e.target.value })} />
            </div>
            <div className="mt-3">
              <Label htmlFor="font">Font</Label>
              <select
                id="font"
                value={profile.font}
                onChange={(e) => update({ font: e.target.value })}
                className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
              >
                {fontOptions.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </Panel>

          <Panel title="Sections">
            <ul className="space-y-2">
              {allSections.map((section) => {
                const enabled = profile.sections.includes(section);
                return (
                  <li key={section} className="flex items-center justify-between rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={enabled} onChange={() => toggleSection(section)} />
                      {sectionMeta[section].label}
                    </label>
                    {enabled ? (
                      <span className="flex gap-1">
                        <button type="button" aria-label={`Move ${section} up`} className="rounded px-2 py-1 hover:bg-ink/5" onClick={() => moveSection(section, -1)}>
                          ↑
                        </button>
                        <button type="button" aria-label={`Move ${section} down`} className="rounded px-2 py-1 hover:bg-ink/5" onClick={() => moveSection(section, 1)}>
                          ↓
                        </button>
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Content">
            <Area label="Skills" value={profile.skills} onChange={(value) => update({ skills: value })} />
            <Area label="Experience" value={profile.experience} onChange={(value) => update({ experience: value })} />
            <Area label="Education" value={profile.education} onChange={(value) => update({ education: value })} />
            <Field label="Email" value={profile.email} onChange={(value) => update({ email: value })} />
            <Field label="LinkedIn" value={profile.linkedin} onChange={(value) => update({ linkedin: value })} />
            <Field label="GitHub" value={profile.github} onChange={(value) => update({ github: value })} />
          </Panel>

          <Panel title="Projects">
            {profile.projects.map((project, index) => (
              <div key={index} className="mb-4 rounded-xl border border-ink/10 bg-white p-3">
                <Field label="Title" value={project.title} onChange={(value) => updateProject(index, "title", value)} />
                <Area label="Description" value={project.description} onChange={(value) => updateProject(index, "description", value)} />
                <Field label="Technologies" value={project.technologies} onChange={(value) => updateProject(index, "technologies", value)} />
                <Field label="URL" value={project.url} onChange={(value) => updateProject(index, "url", value)} />
                <Field label="Image URL" value={project.image} onChange={(value) => updateProject(index, "image", value)} />
              </div>
            ))}
            <Button variant="secondary" className="w-full" onClick={addProject}>
              Add project
            </Button>
          </Panel>
        </aside>

        <section aria-label="Live preview" className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-ink-muted">Preview</h2>
            <div className="flex rounded-full border border-ink/10 bg-white p-1 text-xs">
              <button type="button" className={`rounded-full px-3 py-1 ${preview === "desktop" ? "bg-ink text-paper" : ""}`} onClick={() => setPreview("desktop")}>
                Desktop
              </button>
              <button type="button" className={`rounded-full px-3 py-1 ${preview === "mobile" ? "bg-ink text-paper" : ""}`} onClick={() => setPreview("mobile")}>
                Mobile
              </button>
            </div>
          </div>
          <div className={`overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft ${preview === "mobile" ? "mx-auto max-w-[390px]" : ""}`}>
            <div className={preview === "mobile" ? "max-h-[780px] overflow-y-auto" : "max-h-[calc(100vh-8rem)] overflow-y-auto"}>
              <PortfolioRenderer profile={profile} preview={preview === "mobile"} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white/80 p-4 shadow-soft">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
