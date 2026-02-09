'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Check, X } from 'lucide-react'
import { deleteVisitorPhoto, approveVisitorPhoto, getAllVisitorPhotos } from '@/lib/admin-actions'
import useSWR, { mutate } from 'swr'
import type { VisitorPhoto } from '@/lib/types'
import Image from 'next/image'

export function AdminPhotos() {
  const { data: photos = [] } = useSWR<VisitorPhoto[]>('/api/admin-photos', getAllVisitorPhotos)

  const handleApprove = async (id: string, approved: boolean) => {
    await approveVisitorPhoto(id, approved)
    mutate('/api/admin-photos')
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      await deleteVisitorPhoto(id)
      mutate('/api/admin-photos')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Visitor Photos</h2>

      {photos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No visitor photos yet
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={photo.image_url || "/placeholder.svg"}
                  alt={photo.visitor_name || 'Visitor photo'}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={photo.approved ? "default" : "secondary"}>
                    {photo.approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                {photo.visitor_name && (
                  <p className="text-sm font-medium truncate">{photo.visitor_name}</p>
                )}
                {photo.comment && (
                  <CardDescription className="text-xs line-clamp-2">{photo.comment}</CardDescription>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(photo.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  {!photo.approved ? (
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1"
                      onClick={() => handleApprove(photo.id, true)}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleApprove(photo.id, false)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Unapprove
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(photo.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
