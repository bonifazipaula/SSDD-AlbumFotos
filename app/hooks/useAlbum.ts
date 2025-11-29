"use client"

import { useQuery } from "@tanstack/react-query"
import { albumsService, type Album } from "@/app/services/albums"

export function useAlbum(albumId: string) {
  return useQuery<{ album: Album }, Error>({
    queryKey: ["album", albumId],
    queryFn: () => albumsService.getById(albumId),
    enabled: !!albumId,
    retry: false,
  })
}

export function useAlbums() {
  return useQuery<{ albums: Album[] }, Error>({
    queryKey: ["albums"],
    queryFn: () => albumsService.getAll(),
  })
}
