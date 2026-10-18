export const sectionMeta = {
  about: { label: "About", field: "intro" as const },
  work: { label: "Projects", field: "projects" as const },
  skills: { label: "Skills", field: "skills" as const },
  experience: { label: "Experience", field: "experience" as const },
  education: { label: "Education", field: "education" as const },
  contact: { label: "Contact", field: "contact" as const },
} as const;

export type SectionId = keyof typeof sectionMeta;

export const allSections: SectionId[] = ["about", "work", "skills", "experience", "education", "contact"];
