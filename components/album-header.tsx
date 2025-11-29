"use client"

import Link from "next/link"
import { Camera } from "lucide-react"

export function AlbumHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Camera className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">PhotoShare</span>
        </Link>
      </div>
    </header>
  )
}
