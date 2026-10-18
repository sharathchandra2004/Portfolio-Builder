import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(196,239,90,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(15,15,15,0.06),transparent_40%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase">folio</p>
          <Link href="/build" className="text-sm text-ink-muted hover:text-ink">
            Start building
          </Link>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16 md:py-24">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-ink-muted">Portfolio builder</p>
          <h1 className="max-w-3xl font-display text-5xl leading-tight md:text-7xl">
            Your work, beautifully told — in minutes, not weekends.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Paste a resume or fill a short form. Pick a category and design. Preview on desktop and mobile, tweak copy, then download a standalone site ZIP with deployment instructions.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/build">
              <Button>Create my portfolio</Button>
            </Link>
            <Link href="/editor">
              <Button variant="secondary">Resume a draft</Button>
            </Link>
          </div>
          <ul className="mt-12 grid gap-4 text-sm text-ink-muted md:grid-cols-3">
            <li className="rounded-2xl border border-ink/10 bg-white/70 p-5 shadow-soft">No account — drafts stay in your browser.</li>
            <li className="rounded-2xl border border-ink/10 bg-white/70 p-5 shadow-soft">Nine designs across creative, technical, and general.</li>
            <li className="rounded-2xl border border-ink/10 bg-white/70 p-5 shadow-soft">Export a static site — no AI key required in the bundle.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
