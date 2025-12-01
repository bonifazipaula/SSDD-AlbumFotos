import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/database";
import Album from "@/app/models/Album";
import Photo from "@/app/models/Photo";
import Image from "@/app/models/Image";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/app/lib/utils";

// POST - Subir una foto a un álbum
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const thumbnail = formData.get("thumbnail") as File;
    const albumId = formData.get("albumId") as string;

    if (!file || !albumId) {
      return NextResponse.json(
        { error: "Se requiere un archivo y el ID del álbum" },
        { status: 400 }
      );
    }

    // Verificar que el álbum existe y no ha expirado
    const album = await Album.findOne({ uuid: albumId });

    if (!album) {
      return NextResponse.json(
        { error: "Álbum no encontrado" },
        { status: 404 }
      );
    }

    if (new Date(album.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Este álbum ha expirado" },
        { status: 410 }
      );
    }

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Solo se aceptan JPG, PNG y WebP." },
        { status: 400 }
      );
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "El archivo excede el tamaño máximo de 10MB." },
        { status: 400 }
      );
    }

    const blob = await Image.create({
      photo: Buffer.from(await file.arrayBuffer()),
      thumbnail: Buffer.from(await thumbnail.arrayBuffer()),
      mimeType: file.type,
    });
    const photo = await Photo.create({
      albumId,
      imageId: blob._id,
      fileName: file.name,
      fileSize: file.size,
    });

    return NextResponse.json({
      success: true,
      photo: {
        id: photo._id,
        albumId: photo.albumId,
        imageId: photo.imageId,
        fileName: photo.fileName,
        fileSize: photo.fileSize,
        createdAt: photo.createdAt,
      },
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { error: "Error al subir la foto" },
      { status: 500 }
    );
  }
}

// GET - Obtener fotos de un álbum
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get("albumId");

    if (!albumId) {
      return NextResponse.json(
        { error: "Se requiere el ID del álbum" },
        { status: 400 }
      );
    }

    const photos = await Photo.find({ albumId }).sort({ createdAt: -1 });

    // Calcular estadísticas
    const totalSize = photos.reduce((acc, photo) => acc + photo.fileSize, 0);

    return NextResponse.json({
      photos: photos.map((photo) => ({
        id: photo._id,
        albumId: photo.albumId,
        imageID: photo.imageId,
        fileName: photo.fileName,
        fileSize: photo.fileSize,
        createdAt: photo.createdAt,
      })),
      stats: {
        totalPhotos: photos.length,
        totalSize,
      },
    });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Error al obtener las fotos" },
      { status: 500 }
    );
  }
}
