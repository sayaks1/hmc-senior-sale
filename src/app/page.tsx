'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to HMC Senior Sale</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
          A marketplace exclusively for Harvey Mudd College students to buy and sell items. 
          Connect with fellow students, find great deals, and make your college life easier!
        </p>
        
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {user ? (
            <>
              <Button asChild size="lg" className="w-full">
                <Link href="/marketplace">
                  Browse Marketplace
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/marketplace">
                  Sell an Item
                </Link>
              </Button>
            </>
          ) : (
            <Button asChild size="lg" className="w-full">
              <Link href="/login">
                Sign In to Get Started
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Layout>
  )
}