"use client";
import { openDB } from "idb";
import type { Profile } from "./profile";

const DB = "folio-drafts";
async function getDB() { return openDB(DB, 1, { upgrade(db) { db.createObjectStore("drafts"); } }); }
export async function saveDraft(profile: Profile) { try { const db = await getDB(); await db.put("drafts", profile, "current"); } catch { localStorage.setItem("folio-draft", JSON.stringify(profile)); } }
export async function loadDraft(): Promise<Profile | null> {
  try { const db = await getDB(); const value = await db.get("drafts", "current") as Profile | undefined; if (value) return value; } catch { /* localStorage fallback */ }
  try { const value = localStorage.getItem("folio-draft"); return value ? JSON.parse(value) as Profile : null; } catch { return null; }
}
export async function clearDraft() { try { const db = await getDB(); await db.delete("drafts", "current"); } catch { /* ignore */ } localStorage.removeItem("folio-draft"); }
