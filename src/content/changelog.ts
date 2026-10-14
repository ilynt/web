import { works } from "./works";

// Dated record of what shipped. Lab-wide entries live here; dated status notes
// on works (works.ts → notes with a date) are merged in automatically.
// Dates: "YYYY-MM-DD" or "YYYY-MM". Only record things that actually happened.

export type ChangelogEntry = {
  date: string;
  text: string;
  /** Slug of the related lab entry, if any. */
  work?: string;
};

const labEntries: ChangelogEntry[] = [
  { date: "2026-10-14", text: "Privacy notice published; lab entries in development accept release notifications." },
  {
    date: "2026-10-07",
    text: "ilyntlabs.com launched with the lab index, the Sinyra product page and solutions for organizations.",
  },
];

export const changelog: ChangelogEntry[] = [
  ...labEntries,
  ...works.flatMap((w) =>
    (w.notes ?? []).filter((n) => n.date).map((n) => ({ date: n.date!, text: n.text, work: w.slug })),
  ),
].sort((a, b) => b.date.localeCompare(a.date));
