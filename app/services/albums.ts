import axios from "axios"

const api = axios.create({
  baseURL: "/api",
})

export interface CreateAlbumDTO {
  name: string
  description?: string
  eventDate: string
  password?: string
}

export interface Album {
  uuid: string
  name: string
  description?: string
  eventDate: string
  expiresAt: string
  hasPassword: boolean
  createdAt: string
}

export interface AlbumResponse {
  album: Album
}

export interface AlbumsListResponse {
  albums: Album[]
}

export interface VerifyPasswordResponse {
  valid: boolean
}

export const albumsService = {
  create: async (data: CreateAlbumDTO): Promise<AlbumResponse> => {
    const response = await api.post<AlbumResponse>("/albums", data)
    return response.data
  },

  getById: async (id: string): Promise<AlbumResponse> => {
    const response = await api.get<AlbumResponse>(`/albums/${id}`)
    return response.data
  },

  getAll: async (): Promise<AlbumsListResponse> => {
    const response = await api.get<AlbumsListResponse>("/albums")
    return response.data
  },

  verifyPassword: async (id: string, password: string): Promise<VerifyPasswordResponse> => {
    const response = await api.post<VerifyPasswordResponse>(`/albums/${id}/verify`, {
      password,
    })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/albums/${id}`)
  },

  downloadZip: async (id: string): Promise<Blob> => {
    const response = await api.get(`/albums/${id}/download`, {
      responseType: "blob",
    })
    return response.data
  },
}
