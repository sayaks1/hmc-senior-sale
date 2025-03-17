'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { Listing, Category } from '@/types/listings'

export default function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    fetchCategories()
    fetchListings()
  }, [])

  async function fetchCategories(): Promise<void> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) console.error('Error fetching categories:', error)
    else setCategories(data || [])
  }

  async function fetchListings(): Promise<void> {
    let query = supabase
      .from('listings')
      .select(`
        *,
        users(full_name, email),
        categories(name),
        images(url)
      `)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
    
    const { data, error } = await query
    
    if (error) console.error('Error fetching listings:', error)
    else setListings(data || [])
    
    setLoading(false)
  }

  // Filter listings based on search and category
  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === '' || 
      listing.category_id === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <Layout>
      <div className="marketplace">
        <h1>Browse Items</h1>
        
        <div className="filters">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {loading ? (
          <p>Loading listings...</p>
        ) : (
          <div className="listings-grid">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <Link href={`/listing/${listing.id}`} key={listing.id}>
                  <div className="listing-card">
                    {listing.images && listing.images[0] && (
                      <img 
                        src={listing.images[0].url} 
                        alt={listing.title} 
                      />
                    )}
                    <h3>{listing.title}</h3>
                    <p className="price">${listing.price}</p>
                    <p className="category">{listing.categories?.name}</p>
                    <p className="seller">
                      Seller: {listing.users?.full_name}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No listings found matching your criteria.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}