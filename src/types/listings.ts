export interface User {
    id: string
    full_name: string | null
    email: string
    phone_number?: string | null
    venmo_username?: string | null
  }
  
  export interface Category {
    id: string
    name: string
    description: string | null
  }
  
  export interface Image {
    id: string
    url: string
    listing_id: string
  }
  
  export interface Listing {
    id: string
    title: string
    description: string
    price: number
    user_id: string
    category_id: string
    status: 'available' | 'pending' | 'sold'
    pickup_start_date?: string | null
    pickup_end_date?: string | null
    pickup_location?: string | null
    created_at: string
    updated_at: string | null
    users?: User
    categories?: Category
    images?: Image[]
  }