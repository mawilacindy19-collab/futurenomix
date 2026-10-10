export const CAREER_FIELDS = [
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "Manufacturing",
  "Logistics",
  "Healthcare",
  "Education"
] as const;

export type CareerField = typeof CAREER_FIELDS[number];
