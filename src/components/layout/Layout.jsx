import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const [user, setUser] = useState(null)
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

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="layout">
      <header>
        <nav>
          <Link href="/marketplace">
            <a className="logo">Student Marketplace</a>
          </Link>
          
          {user && (
            <div className="nav-links">
              <Link href="/marketplace">
                <a>Browse</a>
              </Link>
              <Link href="/new-listing">
                <a>Sell Item</a>
              </Link>
              <Link href="/my-listings">
                <a>My Listings</a>
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