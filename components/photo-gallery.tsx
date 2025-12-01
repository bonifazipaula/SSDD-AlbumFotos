"use client";

import { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";
import axios from "axios";
import type { Photo } from "@/app/services/photos";
import { PhotoLightbox } from "./photo-lightbox";
import { Loader2, ImageOff } from "lucide-react";

interface SecureImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

function SecureImage({ src, alt, ...props }: SecureImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    const fetchImage = async () => {
      try {
        const response = await axios.get(`/api/images/${src}`, {
          responseType: "blob",
        });

        const blob = response.data;
        objectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setImageSrc(objectUrl);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) setLoading(false);
      }
    };

    if (src) {
      fetchImage();
    }

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (loading || !imageSrc) {
    return <div className="w-full h-full bg-muted animate-pulse" />;
  }

  return <Image src={imageSrc} alt={alt} {...props} />;
}

interface PhotoGalleryProps {
  photos: Photo[];
  isLoading: boolean;
}

export function PhotoGallery({ photos, isLoading }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <ImageOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No hay fotos aún
        </h3>
        <p className="text-muted-foreground">
          Sé el primero en subir una foto a este álbum
        </p>
      </div>
    );
  }
  console.log(JSON.stringify(photos, null, 2));
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setSelectedIndex(index)}
            className="aspect-square relative rounded-lg overflow-hidden bg-muted group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <SecureImage
              src={photo.imageID || "/placeholder.svg"}
              alt={photo.fileName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <PhotoLightbox
          photos={photos}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
