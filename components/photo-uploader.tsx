"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadPhoto } from "@/app/hooks/usePhotos";
import { validateFile } from "@/app/lib/utils";
import { X, Loader2, CheckCircle, AlertCircle, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploaderProps {
  albumId: string;
}

interface UploadingFile {
  file: File;
  progress: "pending" | "uploading" | "success" | "error";
  error?: string;
}

async function generateThumbnail(file: File, maxWidth = 400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        file.type,
        0.8
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function PhotoUploader({ albumId }: PhotoUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { mutateAsync: uploadPhoto } = useUploadPhoto(albumId);

  const processFile = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, progress: "error", error: validation.error }
            : f
        )
      );
      return;
    }

    // Actualizar estado a uploading
    setUploadingFiles((prev) =>
      prev.map((f) => (f.file === file ? { ...f, progress: "uploading" } : f))
    );

    try {
      const thumbnail = await generateThumbnail(file);

      await uploadPhoto({ file, thumbnail });

      setUploadingFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, progress: "success" } : f))
      );

      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((f) => f.file !== file));
      }, 2000);
    } catch (error) {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, progress: "error", error: "Error al subir la imagen" }
            : f
        )
      );
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        progress: "pending" as const,
      }));
      setUploadingFiles((prev) => [...prev, ...newFiles]);

      for (const file of acceptedFiles) {
        await processFile(file);
      }
    },
    [uploadPhoto]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024,
  });

  const removeFile = (file: File) => {
    setUploadingFiles((prev) => prev.filter((f) => f.file !== file));
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div
            className={`p-4 rounded-full ${
              isDragActive ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <ImagePlus
              className={`h-8 w-8 ${
                isDragActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>
          {isDragActive ? (
            <p className="text-primary font-medium">Suelta las fotos aquí...</p>
          ) : (
            <>
              <p className="text-foreground font-medium">
                Arrastra y suelta tus fotos aquí
              </p>
              <p className="text-sm text-muted-foreground">
                o haz clic para seleccionar archivos
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG, WebP - Máximo 10MB por imagen
              </p>
            </>
          )}
        </div>
      </div>

      {}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((item, index) => (
            <div
              key={`${item.file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg"
            >
              <div className="flex-shrink-0">
                {item.progress === "pending" && (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                )}
                {item.progress === "uploading" && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
                {item.progress === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {item.progress === "error" && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.file.name}
                </p>
                {item.error && (
                  <p className="text-xs text-destructive">{item.error}</p>
                )}
              </div>
              {(item.progress === "error" || item.progress === "pending") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(item.file)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
