"use client"

import { useMutation } from "@tanstack/react-query"
import { albumsService } from "@/app/services/albums"

export function useDownloadAlbum(albumId: string, albumName: string) {
  return useMutation<Blob, Error>({
    mutationFn: () => albumsService.downloadZip(albumId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const sanitizedName = albumName.replace(/[^a-zA-Z0-9]/g, "_")
      link.download = `${sanitizedName}_fotos.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
  })
}
