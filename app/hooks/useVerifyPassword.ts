"use client"

import { useMutation } from "@tanstack/react-query"
import { albumsService } from "@/app/services/albums"

export function useVerifyPassword(albumId: string) {
  return useMutation<{ valid: boolean }, Error, string>({
    mutationFn: (password: string) => albumsService.verifyPassword(albumId, password),
  })
}
