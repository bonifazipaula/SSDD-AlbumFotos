"use client";

import { useState, useEffect, useCallback } from "react";
import type { Photo } from "@/app/services/photos";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecureImage } from "./secure-image";

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export function PhotoLightbox({
  photos,
  initialIndex,
  onClose,
}: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentPhoto = photos[currentIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/api/images/${currentPhoto.imageID}`;
    link.download = currentPhoto.fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goToPrevious, goToNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        <span className="text-white/80 text-sm">
          {currentIndex + 1} / {photos.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="text-white hover:bg-white/10"
          >
            <Download className="h-5 w-5" />
            <span className="sr-only">Descargar</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center p-16">
        <SecureImage
          src={currentPhoto.imageID || "/placeholder.svg"}
          alt={currentPhoto.fileName}
          thumbnail="false"
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {photos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12"
          >
            <ChevronLeft className="h-8 w-8" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12"
          >
            <ChevronRight className="h-8 w-8" />
            <span className="sr-only">Siguiente</span>
          </Button>
        </>
      )}

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white/60 text-sm truncate px-4">
          {currentPhoto.fileName}
        </p>
      </div>
    </div>
  );
}
