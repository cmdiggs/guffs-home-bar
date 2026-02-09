'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'
import type { VisitorPhoto } from '@/lib/types'

export function PhotoGrid({ photos }: { photos: VisitorPhoto[] }) {
  const [selected, setSelected] = useState<VisitorPhoto | null>(null)

  const close = useCallback(() => setSelected(null), [])

  useEffect(() => {
    if (!selected) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [selected, close])

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.slice(0, 8).map((photo) => (
          <button
            type="button"
            key={photo.id}
            className="text-left"
            onClick={() => setSelected(photo)}
          >
            <Card className="overflow-hidden border-border/50 active:ring-2 active:ring-accent/50 transition-all">
              <div className="relative aspect-square">
                <img
                  src={photo.image_url}
                  alt={photo.visitor_name || 'Guest photo'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                {photo.visitor_name && (
                  <p className="text-sm font-medium text-foreground">{photo.visitor_name}</p>
                )}
                {photo.comment && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{photo.comment}</p>
                )}
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md rounded-xl overflow-hidden bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative w-full aspect-square">
              <img
                src={selected.image_url}
                alt={selected.visitor_name || 'Guest photo'}
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            </div>

            <div className="p-5">
              {selected.visitor_name && (
                <p className="text-lg font-semibold text-card-foreground">{selected.visitor_name}</p>
              )}
              {selected.comment && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{selected.comment}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
