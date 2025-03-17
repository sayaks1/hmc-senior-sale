'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    const getUser = async (): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const handleSignOut = async (): Promise<void> => {
    await supabase.auth.signOut()
  }

  return (
    <div className="layout">
      <header>
        <nav>
          <Link href="/marketplace" className="logo">
            Student Marketplace
          </Link>
          
          {user && (
            <div className="nav-links">
              <Link href="/marketplace">
                Browse
              </Link>
              <Link href="/new-listing">
                Sell Item
              </Link>
              <Link href="/my-listings">
                My Listings
              </Link>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </nav>
      </header>
      
      <main>{children}</main>
      
      <footer>
        <p>© {new Date().getFullYear()} Student Marketplace</p>
      </footer>
    </div>
  )
}