"use client"

import { formatBytes } from "@/app/lib/utils"
import { Images, HardDrive, Loader2 } from "lucide-react"

interface AlbumStatsProps {
  totalPhotos: number
  totalSize: number
  isLoading: boolean
}

export function AlbumStats({ totalPhotos, totalSize, isLoading }: AlbumStatsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Cargando estadísticas...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
      <div className="flex items-center gap-2">
        <Images className="h-5 w-5 text-primary" />
        <span className="text-foreground font-medium">{totalPhotos}</span>
        <span className="text-muted-foreground">{totalPhotos === 1 ? "foto" : "fotos"}</span>
      </div>
      <div className="flex items-center gap-2">
        <HardDrive className="h-5 w-5 text-primary" />
        <span className="text-foreground font-medium">{formatBytes(totalSize)}</span>
        <span className="text-muted-foreground">utilizados</span>
      </div>
    </div>
  )
}
