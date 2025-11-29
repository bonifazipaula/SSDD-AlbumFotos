import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IAlbum extends Document {
  _id: mongoose.Types.ObjectId
  uuid: string
  name: string
  description?: string
  eventDate: Date
  passwordHash?: string
  createdAt: Date
  expiresAt: Date
}

const AlbumSchema = new Schema<IAlbum>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    passwordHash: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

// Índice para búsqueda de álbumes expirados
AlbumSchema.index({ expiresAt: 1 })

const Album: Model<IAlbum> = mongoose.models.Album || mongoose.model<IAlbum>("Album", AlbumSchema)

export default Album
