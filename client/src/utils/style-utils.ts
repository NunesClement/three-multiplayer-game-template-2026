import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export interface InferClassName {
  className?: ClassValue;
}
export const pluralize = (word: string, count: number) =>
  count > 1 ? `${word}s` : word;
