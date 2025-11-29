import { CreateAlbumForm } from "@/components/create-album-form"
import { Camera, Users, Clock, Download } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">PhotoShare</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight text-balance">
              Comparte los momentos de tu <span className="text-primary">evento</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Crea álbumes de fotos colaborativos donde todos pueden contribuir. Sin registro, sin complicaciones. Solo
              comparte el enlace y recolecta recuerdos.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Colaborativo</h3>
                  <p className="text-sm text-muted-foreground">Cualquiera con el enlace puede subir fotos</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Temporal</h3>
                  <p className="text-sm text-muted-foreground">Los álbumes expiran 30 días después del evento</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Camera className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Sin registro</h3>
                  <p className="text-sm text-muted-foreground">No necesitas crear una cuenta</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Download className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Descarga fácil</h3>
                  <p className="text-sm text-muted-foreground">Descarga todas las fotos en un ZIP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:pl-8">
            <CreateAlbumForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">PhotoShare - Comparte momentos, crea recuerdos</p>
        </div>
      </footer>
    </main>
  )
}
