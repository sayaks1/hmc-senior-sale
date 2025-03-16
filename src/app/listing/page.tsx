import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Layout from '../../components/layout/Layout'
import { User } from '@supabase/supabase-js'

// Define a type for your listing
type Listing = {
  id: string;
  title: string;
  price: number;
  description: string;
  users: {
    id: string;
    full_name: string;
    email: string;
  };
  categories: {
    name: string;
  };
  images: {
    id: string;
    url: string;
  }[];
  created_at: string;
};

export default function ListingDetail() {
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    
    getUser()
  }, [])

  useEffect(() => {
    if (id) {
      fetchListing()
    }
  }, [id])

  async function fetchListing() {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        users(id, full_name, email),
        categories(name),
        images(id, url)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching listing:', error)
      setLoading(false)
      return
    }
    
    setListing(data)
    setLoading(false)
  }

  const handleContact = () => {
    if (listing && listing.users && listing.users.email) {
      window.location.href = `mailto:${listing.users.email}?subject=Regarding your listing: ${listing.title}`
    }
  }

  if (loading) return (
    <Layout>
      <div className="loading">Loading listing details...</div>
    </Layout>
  )

  if (!listing) return (
    <Layout>
      <div className="error">Listing not found</div>
    </Layout>
  )

  const isOwner = currentUser && listing.users && currentUser.id === listing.users.id

  return (
    <Layout>
      <div className="listing-detail">
        <div className="listing-images">
          {listing.images && listing.images.length > 0 ? (
            listing.images.map((image) => (
              <img 
                key={image.id} 
                src={image.url} 
                alt={listing.title} 
              />
            ))
          ) : (
            <div className="no-image">No images available</div>
          )}
        </div>
        
        <div className="listing-info">
          <h1>{listing.title}</h1>
          <p className="price">${listing.price}</p>
          <p className="category">Category: {listing.categories.name}</p>
          <p className="seller">Seller: {listing.users.full_name}</p>
          <p className="date">
            Posted on: {new Date(listing.created_at).toLocaleDateString()}
          </p>
          
          <div className="description">
            <h2>Description</h2>
            <p>{listing.description}</p>
          </div>
          
          {!isOwner && (
            <button onClick={handleContact} className="contact-button">
              Contact Seller
            </button>
          )}
          
          {isOwner && (
            <div className="owner-actions">
              <button onClick={() => router.push(`/edit-listing/${listing.id}`)}>
                Edit Listing
              </button>
              <button onClick={() => router.push(`/manage-listing/${listing.id}`)}>
                Manage Listing
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}