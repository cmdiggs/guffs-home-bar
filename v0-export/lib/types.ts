export interface Cocktail {
  id: string
  name: string
  friend_name: string
  description: string | null
  ingredients: string[] | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Memorabilia {
  id: string
  title: string
  description: string | null
  image_url: string | null
  featured: boolean
  created_at: string
  updated_at: string
}

export interface VisitorPhoto {
  id: string
  image_url: string
  visitor_name: string | null
  comment: string | null
  approved: boolean
  created_at: string
}
