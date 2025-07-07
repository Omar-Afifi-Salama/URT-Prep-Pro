import type { LucideIcon } from "lucide-react";
import { Atom, BookText, Dna, FlaskConical, Mountain } from "lucide-react";

export type Subject = {
  name: string;
  icon: LucideIcon;
  isScience: boolean;
};

export const SUBJECTS: Subject[] = [
  { name: "English", icon: BookText, isScience: false },
  { name: "Physics", icon: Atom, isScience: true },
  { name: "Chemistry", icon: FlaskConical, isScience: true },
  { name: "Biology", icon: Dna, isScience: true },
  { name: "Geology", icon: Mountain, isScience: true },
];
