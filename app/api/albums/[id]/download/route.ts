import { type NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import connectDB from "@/app/lib/database";
import Album from "@/app/models/Album";
import Photo from "@/app/models/Photo";
import Image from "@/app/models/Image";

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

    if (new Date(album.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Este álbum ha expirado" },
        { status: 410 }
      );
    }

    const photos = await Photo.find({ albumId: id });

    if (photos.length === 0) {
      return NextResponse.json(
        { error: "No hay fotos en este álbum" },
        { status: 404 }
      );
    }

    const zip = new JSZip();

    for (const photo of photos) {
      try {
        const imageDocument = await Image.findOne({ _id: photo.imageId });

        if (!imageDocument) {
          continue;
        }

        const imageBuffer: Buffer = imageDocument.photo;

        zip.file(photo.fileName, imageBuffer);
      } catch (e) {
        console.error(`Error fetching photo ${photo.fileName} from DB:`, e);
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

    const sanitizedName = album.name.replace(/[^a-zA-Z0-9]/g, "_");

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${sanitizedName}_fotos.zip"`,
      },
    });
  } catch (error) {
    console.error("Error downloading album:", error);
    return NextResponse.json(
      { error: "Error al descargar el álbum" },
      { status: 500 }
    );
  }
}
