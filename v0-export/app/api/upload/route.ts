import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('photo') as File
  const visitorName = formData.get('visitor_name') as string
  const comment = formData.get('comment') as string

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  try {
    const blob = await put(`visitor-photos/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    const supabase = await createClient()
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
      return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 })
    }

    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error uploading file:', err)
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
  }
}
