import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IPhoto extends Document {
  _id: mongoose.Types.ObjectId
  albumId: string
  blobUrl: string
  thumbnailUrl: string
  fileName: string
  fileSize: number
  createdAt: Date
}

const PhotoSchema = new Schema<IPhoto>(
  {
    albumId: {
      type: String,
      required: true,
      index: true,
    },
    blobUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Índice compuesto para búsqueda eficiente por álbum
PhotoSchema.index({ albumId: 1, createdAt: -1 })

const Photo: Model<IPhoto> = mongoose.models.Photo || mongoose.model<IPhoto>("Photo", PhotoSchema)

export default Photo
