import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export interface Photo {
  id: string;
  albumId: string;
  imageID: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

export interface PhotosResponse {
  photos: Photo[];
  stats: {
    totalPhotos: number;
    totalSize: number;
  };
}

export interface UploadPhotoResponse {
  success: boolean;
  photo: Photo;
}

export const photosService = {
  getByAlbumId: async (albumId: string): Promise<PhotosResponse> => {
    const response = await api.get<PhotosResponse>("/photos", {
      params: { albumId },
    });
    return response.data;
  },

  upload: async (
    albumId: string,
    file: File,
    thumbnail: Blob
  ): Promise<UploadPhotoResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("thumbnail", thumbnail, `thumb-${file.name}`);
    formData.append("albumId", albumId);

    const response = await api.post<UploadPhotoResponse>("/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
