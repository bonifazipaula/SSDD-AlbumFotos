"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { photosService, type PhotosResponse, type Photo } from "@/app/services/photos"

export function usePhotos(albumId: string) {
  return useQuery<PhotosResponse, Error>({
    queryKey: ["photos", albumId],
    queryFn: () => photosService.getByAlbumId(albumId),
    enabled: !!albumId,
  })
}

export function useUploadPhoto(albumId: string) {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; photo: Photo }, Error, { file: File; thumbnail: Blob }>({
    mutationFn: ({ file, thumbnail }) => photosService.upload(albumId, file, thumbnail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos", albumId] })
    },
  })
}
