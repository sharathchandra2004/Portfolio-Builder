import { NextResponse } from "next/server";
import { profileSchema } from "@/lib/profile";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.text !== "string" || body.text.length > 30_000) return NextResponse.json({ error: "Paste up to 30,000 characters of profile text." }, { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4.1-mini", input: [
          { role: "system", content: "Extract only explicitly supplied facts into JSON matching: name,title,intro,email,location,skills,experience,education,linkedin,github,projects (array of title,description,technologies,url,image). Never invent facts or infer accomplishments. Use empty strings/array for missing values. Improve grammar while preserving meaning. Return JSON only." },
          { role: "user", content: body.text },
        ], text: { format: { type: "json_object" } } }),
      });
      if (response.ok) {
        const result = await response.json();
        const output = result.output?.flatMap((item: { content?: { text?: string }[] }) => item.content || []).find((item: { text?: string }) => item.text)?.text;
        if (output) return NextResponse.json({ profile: profileSchema.partial().parse(JSON.parse(output)), source: "ai" });
      }
    } catch { /* fall through to safe, editable extraction */ }
  }
  const lines = body.text.split(/\n+/).map((line: string) => line.trim()).filter(Boolean);
  const email = body.text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] || "";
  const links = body.text.match(/https?:\/\/[^\s)]+/g) || [];
  const profile = { name: lines[0]?.slice(0, 100) || "", title: lines[1]?.slice(0, 120) || "", intro: lines.slice(2).join(" ").slice(0, 600), email,
    linkedin: links.find((url: string) => url.includes("linkedin.com")) || "", github: links.find((url: string) => url.includes("github.com")) || "", rawText: body.text };
  return NextResponse.json({ profile, source: "basic" });
}
