import { profileSchema, type Profile } from "@/lib/profile";

export function mergeProfile(base: Profile, patch: Partial<Profile>): Profile {
  return profileSchema.parse({
    ...base,
    ...patch,
    projects: patch.projects?.length ? patch.projects : base.projects,
    sections: patch.sections?.length ? patch.sections : base.sections,
  });
}
