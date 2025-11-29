import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/app/lib/database"
import Album from "@/app/models/Album"

// POST - Verificar contraseña del álbum
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: "La contraseña es requerida" }, { status: 400 })
    }

    const album = await Album.findOne({ uuid: id })

    if (!album) {
      return NextResponse.json({ error: "Álbum no encontrado" }, { status: 404 })
    }

    if (!album.passwordHash) {
      return NextResponse.json({ valid: true })
    }

    const isValid = await bcrypt.compare(password, album.passwordHash)

    if (!isValid) {
      return NextResponse.json({ error: "Contraseña incorrecta", valid: false }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error("Error verifying password:", error)
    return NextResponse.json({ error: "Error al verificar la contraseña" }, { status: 500 })
  }
}
