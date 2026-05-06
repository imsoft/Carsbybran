import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Precio almacenado como texto (solo dígitos o con separadores); muestra miles con coma (es-MX). */
export function formatPriceMx(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ""
  const digits = trimmed.replace(/\D/g, "")
  if (!digits) return trimmed
  const n = Number.parseInt(digits, 10)
  if (!Number.isFinite(n)) return trimmed
  return new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 }).format(n)
}
