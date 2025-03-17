'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/components/auth/AuthProvider'
import { Category } from '@/types/listings'

export default function NewListingPage() {
  return (
    <ProtectedRoute>
      <NewListing />
    </ProtectedRoute>
  )
}

function NewListing() {
  const { user } = useAuth()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [images, setImages] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (error) console.error('Error fetching categories:', error)
      else setCategories(data || [])
    }
    
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    
    if (!title || !description || !price || !categoryId) {
      alert('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    
    try {
      // Insert the listing
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert([
          {
            title,
            description,
            price: parseFloat(price),
            category_id: categoryId,
            user_id: user!.id,
            status: 'available'
          }
        ])
        .select()
      
      if (listingError) throw listingError
      
      // Upload images if any
      if (images.length > 0) {
        for (const image of images) {
          const fileExt = image.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${user!.id}/${listing![0].id}/${fileName}`
          
          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('listing-images')
            .upload(filePath, image)
          
          if (uploadError) throw uploadError
          
          // Get public URL
          const { data: publicURL } = supabase.storage
            .from('listing-images')
            .getPublicUrl(filePath)
          
          // Save image reference in database
          const { error: imageError } = await supabase
            .from('images')
            .insert([
              {
                listing_id: listing![0].id,
                url: publicURL.publicUrl
              }
            ])
          
          if (imageError) throw imageError
        }
      }
      
      router.push('/my-listings')
    } catch (error: unknown) {
      console.error('Error creating listing:', error)
      alert('Error creating listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages(files)
    }
  }

  return (
    <Layout>
      <div className="new-listing">
        <h1>Create New Listing</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="images">Images</label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <small>You can select multiple images</small>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </Layout>
  )
}