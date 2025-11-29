import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import connectDB from "@/app/lib/database"
import Album from "@/app/models/Album"

// POST - Crear un nuevo álbum
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, description, eventDate, password } = body

    if (!name || !eventDate) {
      return NextResponse.json({ error: "El nombre y la fecha del evento son requeridos" }, { status: 400 })
    }

    const uuid = uuidv4()
    const event = new Date(eventDate)

    // Calcular fecha de expiración (30 días después del evento)
    const expiresAt = new Date(event)
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Hash de la contraseña si se proporciona
    let passwordHash: string | undefined
    if (password) {
      passwordHash = await bcrypt.hash(password, 10)
    }

    const album = await Album.create({
      uuid,
      name,
      description,
      eventDate: event,
      passwordHash,
      expiresAt,
    })

    return NextResponse.json({
      success: true,
      album: {
        uuid: album.uuid,
        name: album.name,
        description: album.description,
        eventDate: album.eventDate,
        expiresAt: album.expiresAt,
        hasPassword: !!album.passwordHash,
        createdAt: album.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating album:", error)
    return NextResponse.json({ error: "Error al crear el álbum" }, { status: 500 })
  }
}

// GET - Listar todos los álbumes (para admin/debugging)
export async function GET() {
  try {
    await connectDB()

    const albums = await Album.find({
      expiresAt: { $gt: new Date() },
    })
      .select("-passwordHash")
      .sort({ createdAt: -1 })

    return NextResponse.json({ albums })
  } catch (error) {
    console.error("Error fetching albums:", error)
    return NextResponse.json({ error: "Error al obtener los álbumes" }, { status: 500 })
  }
}
