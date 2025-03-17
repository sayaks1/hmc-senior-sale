export type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            id: string
            email: string
            full_name: string | null
            avatar_url: string | null
            phone_number: string | null
            venmo_username: string | null
            created_at: string
          }
          Insert: {
            id?: string
            email: string
            full_name?: string | null
            avatar_url?: string | null
            phone_number?: string | null
            venmo_username?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            email?: string
            full_name?: string | null
            avatar_url?: string | null
            phone_number?: string | null
            venmo_username?: string | null
            created_at?: string
          }
        }
        categories: {
          Row: {
            id: string
            name: string
            description: string | null
            created_at: string
          }
          Insert: {
            id?: string
            name: string
            description?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            name?: string
            description?: string | null
            created_at?: string
          }
        }
        listings: {
          Row: {
            id: string
            title: string
            description: string
            price: number
            user_id: string
            category_id: string
            status: 'available' | 'pending' | 'sold'
            pickup_start_date: string | null
            pickup_end_date: string | null
            pickup_location: string | null
            created_at: string
            updated_at: string | null
          }
          Insert: {
            id?: string
            title: string
            description: string
            price: number
            user_id: string
            category_id: string
            status?: 'available' | 'pending' | 'sold'
            pickup_start_date?: string | null
            pickup_end_date?: string | null
            pickup_location?: string | null
            created_at?: string
            updated_at?: string | null
          }
          Update: {
            id?: string
            title?: string
            description?: string
            price?: number
            user_id?: string
            category_id?: string
            status?: 'available' | 'pending' | 'sold'
            pickup_start_date?: string | null
            pickup_end_date?: string | null
            pickup_location?: string | null
            created_at?: string
            updated_at?: string | null
          }
        }
        images: {
          Row: {
            id: string
            listing_id: string
            url: string
            created_at: string
          }
          Insert: {
            id?: string
            listing_id: string
            url: string
            created_at?: string
          }
          Update: {
            id?: string
            listing_id?: string
            url?: string
            created_at?: string
          }
        }
      }
    }
  }
  
  export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
  export type Insertables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
  export type Updateables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']