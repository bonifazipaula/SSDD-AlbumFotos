"use client"

import { useState, useEffect } from "react"
import { useAlbum } from "@/app/hooks/useAlbum"
import { usePhotos } from "@/app/hooks/usePhotos"
import { PhotoGallery } from "./photo-gallery"
import { PhotoUploader } from "./photo-uploader"
import { AlbumStats } from "./album-stats"
import { PasswordModal } from "./password-modal"
import { DownloadButton } from "./download-button"
import { AlbumHeader } from "./album-header"
import { ShareLink } from "./share-link"
import { formatDate, getDaysUntilExpiration } from "@/app/lib/utils"
import { Loader2, AlertTriangle, Calendar, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AlbumViewProps {
  albumId: string
}

export function AlbumView({ albumId }: AlbumViewProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const { data: albumData, isLoading: albumLoading, error: albumError } = useAlbum(albumId)
  const { data: photosData, isLoading: photosLoading } = usePhotos(albumId)

  const album = albumData?.album
  const photos = photosData?.photos || []
  const stats = photosData?.stats || { totalPhotos: 0, totalSize: 0 }

  // Verificar si el álbum requiere contraseña
  useEffect(() => {
    if (album) {
      if (album.hasPassword && !isAuthenticated) {
        setShowPasswordModal(true)
      } else if (!album.hasPassword) {
        setIsAuthenticated(true)
      }
    }
  }, [album, isAuthenticated])

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true)
    setShowPasswordModal(false)
  }

  // Estados de carga y error
  if (albumLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Cargando álbum...</p>
        </div>
      </div>
    )
  }

  if (albumError) {
    const is410 = albumError.message?.includes("410") || albumError.message?.includes("expirado")

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{is410 ? "Álbum expirado" : "Álbum no encontrado"}</AlertTitle>
          <AlertDescription>
            {is410
              ? "Este álbum ha superado su fecha de expiración y ha sido eliminado."
              : "El álbum que buscas no existe o el enlace es incorrecto."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!album) {
    return null
  }

  // Modal de contraseña
  if (showPasswordModal && album.hasPassword) {
    return <PasswordModal albumId={albumId} albumName={album.name} onSuccess={handlePasswordSuccess} />
  }

  // Si no está autenticado y requiere contraseña, no mostrar nada
  if (album.hasPassword && !isAuthenticated) {
    return null
  }

  const daysRemaining = getDaysUntilExpiration(new Date(album.expiresAt))

  return (
    <div className="min-h-screen bg-background">
      <AlbumHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Información del álbum */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">{album.name}</h1>
          {album.description && <p className="text-muted-foreground text-lg mb-4">{album.description}</p>}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Evento: {formatDate(new Date(album.eventDate))}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{daysRemaining > 0 ? `Expira en ${daysRemaining} días` : "Expira hoy"}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <ShareLink albumId={albumId} />
        </div>

        {/* Estadísticas y acciones */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <AlbumStats totalPhotos={stats.totalPhotos} totalSize={stats.totalSize} isLoading={photosLoading} />
          <div className="flex items-center gap-3">
            <DownloadButton albumId={albumId} albumName={album.name} disabled={stats.totalPhotos === 0} />
          </div>
        </div>

        {/* Uploader */}
        <div className="mb-8">
          <PhotoUploader albumId={albumId} />
        </div>

        {/* Galería */}
        <PhotoGallery photos={photos} isLoading={photosLoading} />
      </main>
    </div>
  )
}
