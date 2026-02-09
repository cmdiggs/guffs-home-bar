'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'

export async function getCocktails() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cocktails')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cocktails:', error)
    return []
  }

  return data
}

export async function getMemorabilia() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('memorabilia')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching memorabilia:', error)
    return []
  }

  return data
}

export async function getVisitorPhotos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('visitor_photos')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching visitor photos:', error)
    return []
  }

  return data
}

export async function uploadVisitorPhoto(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('photo') as File
  const visitorName = formData.get('visitor_name') as string
  const comment = formData.get('comment') as string

  if (!file || file.size === 0) {
    return { error: 'No file provided' }
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(`visitor-photos/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    // Insert record
    const { error: insertError } = await supabase
      .from('visitor_photos')
      .insert({
        image_url: blob.url,
        visitor_name: visitorName || null,
        comment: comment || null,
        approved: false,
      })

    if (insertError) {
      console.error('Error inserting record:', insertError)
      return { error: 'Failed to save photo' }
    }

    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('Error uploading file:', err)
    return { error: 'Failed to upload photo' }
  }
}
