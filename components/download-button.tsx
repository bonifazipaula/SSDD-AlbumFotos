"use client"

import { useDownloadAlbum } from "@/app/hooks/useDownloadAlbum"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

interface DownloadButtonProps {
  albumId: string
  albumName: string
  disabled?: boolean
}

export function DownloadButton({ albumId, albumName, disabled }: DownloadButtonProps) {
  const { mutate: downloadAlbum, isPending } = useDownloadAlbum(albumId, albumName)

  return (
    <Button
      onClick={() => downloadAlbum()}
      disabled={disabled || isPending}
      variant="outline"
      className="border-border text-foreground hover:bg-muted"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Preparando...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Descargar ZIP
        </>
      )}
    </Button>
  )
}
