import { AlbumView } from "@/components/album-view"

interface AlbumPageProps {
  params: Promise<{ id: string }>
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params

  return <AlbumView albumId={id} />
}
