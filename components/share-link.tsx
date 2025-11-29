"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Share2 } from "lucide-react"

interface ShareLinkProps {
  albumId: string
}

export function ShareLink({ albumId }: ShareLinkProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/album/${albumId}` : `/album/${albumId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Álbum de fotos compartido",
          text: "¡Mira este álbum de fotos!",
          url: shareUrl,
        })
      } catch (err) {
        // Usuario canceló el share
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Comparte este enlace</span>
      </div>
      <div className="flex gap-2">
        <Input value={shareUrl} readOnly className="bg-input border-border text-foreground text-sm" />
        <Button
          onClick={handleCopy}
          variant="outline"
          size="icon"
          className="border-border flex-shrink-0 bg-transparent"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copiar enlace</span>
        </Button>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <Button
            onClick={handleShare}
            variant="default"
            size="icon"
            className="bg-primary hover:bg-primary/90 flex-shrink-0"
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Compartir</span>
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Cualquier persona con este enlace podrá ver y subir fotos al álbum
      </p>
    </div>
  )
}
