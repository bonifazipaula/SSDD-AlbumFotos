import { type NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"
import connectDB from "@/app/lib/database"
import Album from "@/app/models/Album"
import Photo from "@/app/models/Photo"

// GET - Descargar todas las fotos del álbum como ZIP
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const album = await Album.findOne({ uuid: id })

    if (!album) {
      return NextResponse.json({ error: "Álbum no encontrado" }, { status: 404 })
    }

    if (new Date(album.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Este álbum ha expirado" }, { status: 410 })
    }

    const photos = await Photo.find({ albumId: id })

    if (photos.length === 0) {
      return NextResponse.json({ error: "No hay fotos en este álbum" }, { status: 404 })
    }

    const zip = new JSZip()

    // Descargar cada foto y añadirla al ZIP
    for (const photo of photos) {
      try {
        const response = await fetch(photo.blobUrl)
        const arrayBuffer = await response.arrayBuffer()
        zip.file(photo.fileName, arrayBuffer)
      } catch (e) {
        console.error(`Error fetching photo ${photo.fileName}:`, e)
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" })

    const sanitizedName = album.name.replace(/[^a-zA-Z0-9]/g, "_")

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${sanitizedName}_fotos.zip"`,
      },
    })
  } catch (error) {
    console.error("Error downloading album:", error)
    return NextResponse.json({ error: "Error al descargar el álbum" }, { status: 500 })
  }
}
