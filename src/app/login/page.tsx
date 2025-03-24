'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Layout from '@/components/layout/Layout'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/')
      }
    }
    checkUser()

    // Check for error message in URL
    const error = searchParams.get('error')
    if (error) {
      setMessage(decodeURIComponent(error))
    }
  }, [router, searchParams])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setMessage('')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            next: '/'
          }
        }
      })
      
      if (error) throw error

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'message' in error
          ? String((error as {message: string}).message)
          : 'An error occurred during authentication';
      setMessage(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="mt-2 text-gray-600">Use your Google account to sign in</p>
          </div>
          
          {message && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
              {message}
            </div>
          )}
          
          <button 
            onClick={handleGoogleSignIn} 
            disabled={loading}
            className="google-signin-button w-full"
          >
            {loading ? 'Processing...' : 'Sign in with Google'}
          </button>
          
          <p className="text-center text-sm text-gray-600">
            We&apos;ll create an account for you automatically if you don&apos;t have one.
          </p>
        </div>
      </div>
    </Layout>
  )
}