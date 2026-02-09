'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { createCocktail, updateCocktail, deleteCocktail } from '@/lib/admin-actions'
import { getCocktails } from '@/lib/actions'
import { Badge } from '@/components/ui/badge'
import useSWR, { mutate } from 'swr'
import type { Cocktail } from '@/lib/types'

export function AdminCocktails() {
  const { data: cocktails = [] } = useSWR<Cocktail[]>('/api/cocktails', getCocktails)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCocktail, setEditingCocktail] = useState<Cocktail | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      if (editingId) {
        await updateCocktail(editingId, formData)
        setEditingId(null)
      } else {
        await createCocktail(formData)
      }
      
      e.currentTarget.reset()
      setShowForm(false)
      setEditingCocktail(null)
      mutate('/api/cocktails')
    } catch (error) {
      console.error('[v0] Error saving cocktail:', error)
      alert('Error saving cocktail. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this cocktail?')) {
      await deleteCocktail(id)
      mutate('/api/cocktails')
    }
  }

  const handleEdit = (cocktail: Cocktail) => {
    setEditingCocktail(cocktail)
    setEditingId(cocktail.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Cocktails</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setEditingCocktail(null) }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Cocktail
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Add'} Cocktail</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="cocktail-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Cocktail Name</Label>
                  <Input id="name" name="name" required defaultValue={editingCocktail?.name || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="friend_name">Friend's Name</Label>
                  <Input id="friend_name" name="friend_name" required defaultValue={editingCocktail?.friend_name || ''} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} defaultValue={editingCocktail?.description || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients (one per line)</Label>
                <Textarea id="ingredients" name="ingredients" rows={5} defaultValue={editingCocktail?.ingredients?.join('\n') || ''} />
              </div>
              {!editingId && (
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <Input id="image" name="image" type="file" accept="image/*" />
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setEditingCocktail(null) }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cocktails.map((cocktail) => (
          <Card key={cocktail.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{cocktail.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="mt-1">{cocktail.friend_name}</Badge>
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(cocktail)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(cocktail.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {cocktail.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{cocktail.description}</p>
                {cocktail.ingredients && cocktail.ingredients.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium">Ingredients:</p>
                    <ul className="text-xs text-muted-foreground">
                      {cocktail.ingredients.map((ing, idx) => (
                        <li key={idx}>• {ing}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
