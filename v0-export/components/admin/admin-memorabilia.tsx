'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { createMemorabilia, updateMemorabilia, deleteMemorabilia } from '@/lib/admin-actions'
import { getMemorabilia } from '@/lib/actions'
import { Badge } from '@/components/ui/badge'
import useSWR, { mutate } from 'swr'
import type { Memorabilia } from '@/lib/types'

export function AdminMemorabilia() {
  const { data: memorabilia = [] } = useSWR<Memorabilia[]>('/api/memorabilia', getMemorabilia)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    if (editingId) {
      await updateMemorabilia(editingId, formData)
      setEditingId(null)
    } else {
      await createMemorabilia(formData)
    }
    
    e.currentTarget.reset()
    setShowForm(false)
    mutate('/api/memorabilia')
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteMemorabilia(id)
      mutate('/api/memorabilia')
    }
  }

  const handleEdit = (item: Memorabilia) => {
    setEditingId(item.id)
    setShowForm(true)
    
    setTimeout(() => {
      const form = document.getElementById('memorabilia-form') as HTMLFormElement
      if (form) {
        (form.elements.namedItem('title') as HTMLInputElement).value = item.title
        (form.elements.namedItem('description') as HTMLTextAreaElement).value = item.description ? item.description : ''
        (form.elements.namedItem('featured') as HTMLInputElement).checked = item.featured
      }
    }, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Memorabilia</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null) }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Add'} Memorabilia</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="memorabilia-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} />
              </div>
              {!editingId && (
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <Input id="image" name="image" type="file" accept="image/*" />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox id="featured" name="featured" />
                <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
                  Featured item
                </Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null) }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memorabilia.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {item.title}
                    {item.featured && (
                      <Badge variant="default" className="bg-accent text-accent-foreground">
                        Featured
                      </Badge>
                    )}
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {item.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
