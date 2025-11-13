import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind class names safely.
 * Example: cn("p-2", isActive && "bg-blue-500")
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
