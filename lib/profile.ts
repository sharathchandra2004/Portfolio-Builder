import { z } from "zod";

export const categorySchema = z.enum(["creative", "technical", "general"]);
export const designSchema = z.enum(["editorial", "gallery", "bold", "minimal", "terminal", "product", "classic", "brand", "story"]);
export const projectSchema = z.object({ title: z.string(), description: z.string(), technologies: z.string(), url: z.string(), image: z.string() });
export const profileSchema = z.object({
  name: z.string().default(""), title: z.string().default(""), intro: z.string().default(""), category: categorySchema.default("creative"), design: designSchema.default("editorial"),
  email: z.string().default(""), location: z.string().default(""), skills: z.string().default(""), experience: z.string().default(""), education: z.string().default(""),
  linkedin: z.string().default(""), github: z.string().default(""), accent: z.string().default("#c4ef5a"), font: z.string().default("Space Grotesk"),
  projects: z.array(projectSchema).default([]), sections: z.array(z.string()).default(["about", "work", "skills", "experience", "contact"]), rawText: z.string().default(""),
});
export type Profile = z.infer<typeof profileSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Design = z.infer<typeof designSchema>;
export const emptyProfile = (): Profile => profileSchema.parse({ projects: [{ title: "", description: "", technologies: "", url: "", image: "" }] });

export const designs: Record<Category, { id: Design; name: string; description: string; number: string }[]> = {
  creative: [
    { id: "editorial", name: "Editorial minimal", description: "Quiet confidence, generous space", number: "01" },
    { id: "gallery", name: "Visual gallery", description: "Let the work take the lead", number: "02" },
    { id: "bold", name: "Bold experimental", description: "A little more you, everywhere", number: "03" },
  ],
  technical: [
    { id: "minimal", name: "Developer minimal", description: "Clear, focused, recruiter-ready", number: "01" },
    { id: "terminal", name: "Terminal inspired", description: "A subtle nod to the craft", number: "02" },
    { id: "product", name: "Product engineer", description: "Engineering meets product thinking", number: "03" },
  ],
  general: [
    { id: "classic", name: "Professional classic", description: "Credible, clear, considered", number: "01" },
    { id: "brand", name: "Modern personal brand", description: "A memorable point of view", number: "02" },
    { id: "story", name: "Story driven", description: "A journey worth following", number: "03" },
  ],
};

export const categoryLabels: Record<Category, string> = { creative: "Creative", technical: "Technical", general: "General" };
