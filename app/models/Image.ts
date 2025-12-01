import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IImage extends Document {
  _id: mongoose.Types.ObjectId;
  photo: Buffer;
  thumbnail: Buffer;
  mimeType: string;
  createdAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    photo: {
      type: Buffer,
      required: true,
    },
    thumbnail: {
      type: Buffer,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Image: Model<IImage> =
  mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);

export default Image;
