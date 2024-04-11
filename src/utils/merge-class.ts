/**
 * * Define common function to usesable
 */

import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn
 * * Concat multiple custome class in tailwindcss
 * !DO NOT DELETE THIS FUNCTION
 * @param tailwind classname arr
 */

export const cn = (...input: ClassValue[]) => {
  return twMerge(clsx(input));
};
