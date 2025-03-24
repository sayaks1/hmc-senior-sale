'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MyListings() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to marketplace immediately
    router.push('/marketplace')
  }, [router])

  // Show a simple loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  )
} 