import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatea bytes a una representación legible (KB, MB, GB)
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// Formatea una fecha a un string legible
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

// Calcula los días restantes hasta la expiración
export function getDaysUntilExpiration(expiresAt: Date): number {
  const now = new Date()
  const expiration = new Date(expiresAt)
  const diffTime = expiration.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// Verifica si un álbum ha expirado
export function isAlbumExpired(expiresAt: Date): boolean {
  return new Date(expiresAt) < new Date()
}

// Tipos de archivo permitidos
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Valida el tipo y tamaño de un archivo
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Formato no permitido. Solo se aceptan JPG, PNG y WebP.",
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "El archivo excede el tamaño máximo de 10MB.",
    }
  }

  return { valid: true }
}
