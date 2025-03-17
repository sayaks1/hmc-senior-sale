'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
// import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  // const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        // Remove the redirect logic from here since we're handling it in handleSignOut
      }
    )

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      // Redirect to home page instead of login
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://hmc-senior-sale-jytiirw1h-saya-kim-suzukis-projects.vercel.app'
        : window.location.origin
      window.location.href = baseUrl
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="layout">
      <header>
        <nav>
          <Link href="/" className="logo">
            HMC Senior Sale
          </Link>
          
          <div className="nav-links">
            <Link href="/marketplace">
              Browse
            </Link>
            
            {user ? (
              <>
                <Link href="/new-listing">
                  Sell Item
                </Link>
                <Link href="/my-listings">
                  My Listings
                </Link>
                <button onClick={handleSignOut}>Sign Out</button>
              </>
            ) : (
              <Link href="/login">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>
      
      <main>{children}</main>
      
      <footer>
        <p>© {new Date().getFullYear()} HMC Senior Sale</p>
      </footer>
    </div>
  )
}