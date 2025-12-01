import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/database";
import Album from "@/app/models/Album";
import Photo from "@/app/models/Photo";

// GET - Obtener un álbum por UUID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const album = await Album.findOne({ uuid: id });

    if (!album) {
      return NextResponse.json(
        { error: "Álbum no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si el álbum ha expirado
    if (new Date(album.expiresAt) < new Date()) {
      // Eliminar el álbum expirado y sus fotos
      const photos = await Photo.find({ albumId: id });

      // Eliminar blobs de las fotos
      // for (const photo of photos) {
      //   try {
      //     await del(photo.blobUrl);
      //     if (photo.thumbnailUrl) {
      //       await del(photo.thumbnailUrl);
      //     }
      //   } catch (e) {
      //     console.error("Error deleting blob:", e);
      //   }
      // }

      await Photo.deleteMany({ albumId: id });
      await Album.deleteOne({ uuid: id });

      return NextResponse.json(
        { error: "Este álbum ha expirado y ha sido eliminado" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      album: {
        uuid: album.uuid,
        name: album.name,
        description: album.description,
        eventDate: album.eventDate,
        expiresAt: album.expiresAt,
        hasPassword: !!album.passwordHash,
        createdAt: album.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching album:", error);
    return NextResponse.json(
      { error: "Error al obtener el álbum" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un álbum y todas sus fotos
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const album = await Album.findOne({ uuid: id });

    if (!album) {
      return NextResponse.json(
        { error: "Álbum no encontrado" },
        { status: 404 }
      );
    }

    // Obtener todas las fotos del álbum
    const photos = await Photo.find({ albumId: id });

    // Eliminar blobs de las fotos
    // for (const photo of photos) {
    //   try {
    //     await del(photo.blobUrl);
    //     if (photo.thumbnailUrl) {
    //       await del(photo.thumbnailUrl);
    //     }
    //   } catch (e) {
    //     console.error("Error deleting blob:", e);
    //   }
    // }

    // Eliminar registros de fotos
    await Photo.deleteMany({ albumId: id });

    // Eliminar el álbum
    await Album.deleteOne({ uuid: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting album:", error);
    return NextResponse.json(
      { error: "Error al eliminar el álbum" },
      { status: 500 }
    );
  }
}
