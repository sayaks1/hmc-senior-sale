'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function NotFound() {
  const pathname = usePathname()
  const router = useRouter()
  
  useEffect(() => {
    if (pathname?.includes('my-listing')) {
      // If coming from my-listings, redirect to marketplace
      router.replace('/marketplace')
    }
  }, [pathname, router])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <button 
        onClick={() => router.push('/')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Home
      </button>
    </div>
  )
} 