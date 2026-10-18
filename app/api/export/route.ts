import JSZip from "jszip";
import { NextResponse } from "next/server";
import { exportPackageJson, exportReadme } from "@/lib/export-meta";
import { renderPortfolioDocument } from "@/lib/export-html";
import { profileSchema } from "@/lib/profile";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body?.profile);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile payload." }, { status: 400 });
  }

  const profile = parsed.data;
  const zip = new JSZip();
  zip.file("index.html", renderPortfolioDocument(profile));
  zip.file("README.md", exportReadme(profile));
  zip.file("package.json", exportPackageJson());
  zip.file(".gitignore", "node_modules\n.DS_Store\n");

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  const filename = `${(profile.name || "portfolio").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "portfolio"}-site.zip`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
