'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'

// Cocktail actions
export async function createCocktail(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const friendName = formData.get('friend_name') as string
  const description = formData.get('description') as string
  const ingredientsStr = formData.get('ingredients') as string
  const ingredients = ingredientsStr.split('\n').filter(i => i.trim())
  const imageFile = formData.get('image') as File | null

  let imageUrl = null

  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(`cocktails/${Date.now()}-${imageFile.name}`, imageFile, {
        access: 'public',
      })
      imageUrl = blob.url
    } catch (err) {
      console.error('Error uploading cocktail image:', err)
    }
  }

  const { error } = await supabase.from('cocktails').insert({
    name,
    friend_name: friendName,
    description: description || null,
    ingredients,
    image_url: imageUrl,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function updateCocktail(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const friendName = formData.get('friend_name') as string
  const description = formData.get('description') as string
  const ingredientsStr = formData.get('ingredients') as string
  const ingredients = ingredientsStr.split('\n').filter(i => i.trim())

  const { error } = await supabase
    .from('cocktails')
    .update({
      name,
      friend_name: friendName,
      description: description || null,
      ingredients,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteCocktail(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('cocktails')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

// Memorabilia actions
export async function createMemorabilia(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const featured = formData.get('featured') === 'on'
  const imageFile = formData.get('image') as File | null

  let imageUrl = null

  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(`memorabilia/${Date.now()}-${imageFile.name}`, imageFile, {
        access: 'public',
      })
      imageUrl = blob.url
    } catch (err) {
      console.error('Error uploading memorabilia image:', err)
    }
  }

  const { error } = await supabase.from('memorabilia').insert({
    title,
    description: description || null,
    featured,
    image_url: imageUrl,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function updateMemorabilia(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const featured = formData.get('featured') === 'on'

  const { error } = await supabase
    .from('memorabilia')
    .update({
      title,
      description: description || null,
      featured,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteMemorabilia(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('memorabilia')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

// Photo actions
export async function getAllVisitorPhotos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('visitor_photos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all visitor photos:', error)
    return []
  }

  return data
}

export async function approveVisitorPhoto(id: string, approved: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('visitor_photos')
    .update({ approved })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteVisitorPhoto(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('visitor_photos')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}
