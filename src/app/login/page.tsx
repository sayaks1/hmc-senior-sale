'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setMessage('')
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      // The user will be redirected to Google for authentication,
      // so we don't need to handle success here
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
      <div className="auth-container">
        <h1>Sign In</h1>
        
        {message && <div className="message">{message}</div>}
        
        <button 
          onClick={handleGoogleSignIn} 
          disabled={loading}
          className="google-signin-button"
        >
          {loading ? 'Processing...' : 'Sign in with Google'}
        </button>
        
        <p className="auth-info">
          Use your Google account to sign in. We'll create an account for you automatically if you don't have one.
        </p>
      </div>
    </Layout>
  )
}