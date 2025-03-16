import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Layout from '../components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function MyListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
      } else {
        setUser(user)
        fetchListings(user.id)
      }
    }
    
    getUser()
  }, [router])

  async function fetchListings(userId) {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        categories(name),
        images(url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) console.error('Error fetching listings:', error)
    else setListings(data || [])
    
    setLoading(false)
  }

  async function updateListingStatus(id, status) {
    const { error } = await supabase
      .from('listings')
      .update({ status })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating listing:', error)
      alert('Error updating listing status')
    } else {
      // Refresh listings
      fetchListings(user.id)
    }
  }

  async function deleteListing(id) {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting listing:', error)
        alert('Error deleting listing')
      } else {
        // Refresh listings
        fetchListings(user.id)
      }
    }
  }

  return (
    <Layout>
      <div className="my-listings">
        <h1>My Listings</h1>
        
        <Link href="/new-listing">
          <a className="create-button">Create New Listing</a>
        </Link>
        
        {loading ? (
          <p>Loading your listings...</p>
        ) : (
          <>
            {listings.length > 0 ? (
              <div className="listings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id}>
                        <td>
                          {listing.images && listing.images[0] ? (
                            <img 
                              src={listing.images[0].url} 
                              alt={listing.title}
                              className="thumbnail" 
                            />
                          ) : (
                            <div className="no-image">No image</div>
                          )}
                        </td>
                        <td>{listing.title}</td>
                        <td>${listing.price}</td>
                        <td>{listing.categories.name}</td>
                        <td>
                          <select
                            value={listing.status}
                            onChange={(e) => updateListingStatus(listing.id, e.target.value)}
                          >
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="sold">Sold</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link href={`/listing/${listing.id}`}>
                              <a className="view-button">View</a>
                            </Link>
                            <Link href={`/edit-listing/${listing.id}`}>
                              <a className="edit-button">Edit</a>
                            </Link>
                            <button
                              onClick={() => deleteListing(listing.id)}
                              className="delete-button"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>You haven't created any listings yet.</p>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}