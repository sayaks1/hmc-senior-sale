'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Redirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/marketplace')
  }, [router])

  // Show nothing
  return null
} 