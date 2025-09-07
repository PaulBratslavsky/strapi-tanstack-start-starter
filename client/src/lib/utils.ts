
import { clsx, } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ClassValue } from "clsx";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function getStrapiURL() {
  return import.meta.env.VITE_STRAPI_URL ?? "http://localhost:1337";
}

export function getStrapiMedia(url: string): string {
  if (!url) return '';
  if (url.startsWith("data:") || url.startsWith("http") || url.startsWith("//")) {
    return url;
  }
  const BASE_URL = import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";
  return `${BASE_URL}${url}`;
}