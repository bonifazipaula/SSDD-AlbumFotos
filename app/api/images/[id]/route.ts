import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/database";
import Image from "@/app/models/Image";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  // Aunque el tipo es simple, la desestructuración debe ser tratada como asíncrona por el warning
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = (await Promise.resolve(params)) as { id: string };

    const { searchParams } = new URL(request.url);
    const imageType = searchParams.get("type") || "photo";

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de imagen inválido." },
        { status: 400 }
      );
    }

    const image = await Image.findOne({ _id: id });
    if (!image) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      );
    }

    let bufferToSend: Buffer;

    if (imageType === "thumbnail") {
      if (!image.thumbnail) {
        return NextResponse.json(
          { error: "Miniatura no disponible" },
          { status: 404 }
        );
      }
      bufferToSend = image.thumbnail;
    } else {
      bufferToSend = image.photo;
    }

    if (!bufferToSend) {
      return NextResponse.json(
        {
          error:
            "El contenido de la imagen (Buffer) está vacío o corrupto en la DB.",
        },
        { status: 404 }
      );
    }

    const arrayBuffer = new Uint8Array(bufferToSend).buffer;

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": bufferToSend.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Error interno al obtener la imagen" },
      { status: 500 }
    );
  }
}
