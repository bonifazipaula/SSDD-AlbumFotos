"use client";

import { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";
import axios from "axios";

interface SecureImageProps extends Omit<ImageProps, "src"> {
  src: string;
  thumbnail: string;
}

export function SecureImage({
  src,
  alt,
  thumbnail,
  ...props
}: SecureImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;
    console.log(thumbnail);
    const fetchImage = async () => {
      try {
        let response = null;
        if (thumbnail === "true") {
          response = await axios.get(`/api/images/${src}`, {
            responseType: "blob",
            params: {
              type: "thumbnail",
            },
          });
        } else {
          response = await axios.get(`/api/images/${src}`, {
            responseType: "blob",
          });
        }

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
