'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <Layout>
      <div className="landing-page">
        <h1>Welcome to HMC Senior Sale</h1>
        <p className="description">
          A marketplace exclusively for Harvey Mudd College students to buy and sell items. 
          Connect with fellow students, find great deals, and make your college life easier!
        </p>
        
        {user ? (
          <div className="cta-buttons">
            <Link href="/marketplace" className="primary-button">
              Browse Marketplace
            </Link>
            <Link href="/new-listing" className="secondary-button">
              Sell an Item
            </Link>
            <Link href="/my-listings" className="secondary-button">
              My Listings
            </Link>
          </div>
        ) : (
          <div className="cta-buttons">
            <Link href="/login" className="primary-button">
              Sign In to Get Started
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}