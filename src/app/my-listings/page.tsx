'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'

export default function MyListings() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <p>Loading...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">My Listings</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <p className="text-gray-600 mb-4">You don't have any listings yet.</p>
          
          <Button asChild>
            <a href="/new-listing">Create Your First Listing</a>
          </Button>
        </div>
      </div>
    </Layout>
  )
} 