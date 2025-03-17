'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState<boolean>(false)

  const handleLogin = async (): Promise<void> => {
    try {
      setLoading(true)
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'message' in error
          ? String((error as {message: string}).message)
          : 'An unknown error occurred';
      alert(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h1>Student Marketplace</h1>
      <p>Sign in with your g.hmc.edu email</p>
      <button
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Sign in with Google'}
      </button>
    </div>
  )
}