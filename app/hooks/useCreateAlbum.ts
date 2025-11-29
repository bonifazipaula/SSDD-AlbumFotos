"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { albumsService, type CreateAlbumDTO, type Album } from "@/app/services/albums"

export function useCreateAlbum() {
  const router = useRouter()

  return useMutation<{ album: Album }, Error, CreateAlbumDTO>({
    mutationFn: (data) => albumsService.create(data),
    onSuccess: (data) => {
      router.push(`/album/${data.album.uuid}`)
    },
  })
}
