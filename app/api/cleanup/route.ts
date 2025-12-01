import { NextResponse } from "next/server";
import connectDB from "@/app/lib/database";
import Album from "@/app/models/Album";
import Photo from "@/app/models/Photo";

// POST - Limpiar álbumes expirados
// Este endpoint puede ser llamado periódicamente (cron) o manualmente
export async function POST() {
  try {
    await connectDB();

    // Buscar álbumes expirados
    const expiredAlbums = await Album.find({
      expiresAt: { $lt: new Date() },
    });

    if (expiredAlbums.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No hay álbumes expirados para eliminar",
        deleted: 0,
      });
    }

    let deletedAlbums = 0;
    let deletedPhotos = 0;

    for (const album of expiredAlbums) {
      // Obtener fotos del álbum
      const photos = await Photo.find({ albumId: album.uuid });

      // Eliminar blobs
      // for (const photo of photos) {
      //   try {
      //     await del(photo.blobUrl);
      //     if (photo.thumbnailUrl && photo.thumbnailUrl !== photo.blobUrl) {
      //       await del(photo.thumbnailUrl);
      //     }
      //     deletedPhotos++;
      //   } catch (e) {
      //     console.error("Error deleting blob:", e);
      //   }
      // }

      // Eliminar registros de fotos
      await Photo.deleteMany({ albumId: album.uuid });

      // Eliminar álbum
      await Album.deleteOne({ uuid: album.uuid });
      deletedAlbums++;
    }

    return NextResponse.json({
      success: true,
      message: `Se eliminaron ${deletedAlbums} álbumes y ${deletedPhotos} fotos`,
      deleted: deletedAlbums,
      photosDeleted: deletedPhotos,
    });
  } catch (error) {
    console.error("Error cleaning up albums:", error);
    return NextResponse.json(
      { error: "Error al limpiar álbumes expirados" },
      { status: 500 }
    );
  }
}
