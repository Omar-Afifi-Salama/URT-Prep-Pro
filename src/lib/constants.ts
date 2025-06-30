import type { LucideIcon } from "lucide-react";
import { Atom, BookText, Dna, FlaskConical, Mountain } from "lucide-react";

export type Subject = {
  name: string;
  icon: LucideIcon;
};

export const SUBJECTS: Subject[] = [
  { name: "English", icon: BookText },
  { name: "Physics", icon: Atom },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Biology", icon: Dna },
  { name: "Geology", icon: Mountain },
];
