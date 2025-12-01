import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/database";
import Image from "@/app/models/Image";
import mongoose from "mongoose";

// GET - Obtener un álbum por UUID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const image = await Image.findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (!image) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(image.photo, {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": image.photo.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Error al obtener el imagen" },
      { status: 500 }
    );
  }
}
