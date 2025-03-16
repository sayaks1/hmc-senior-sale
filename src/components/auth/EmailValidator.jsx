import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function EmailValidator() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (user) {
        // Check if email ends with g.hmc.edu
        if (!user.email.endsWith('g.hmc.edu')) {
          alert('You must use a g.hmc.edu email to access this site')
          await supabase.auth.signOut()
          router.push('/')
        } else {
          router.push('/marketplace')
        }
      }
    }
    
    checkUser()
  }, [router])

  if (loading) return <div>Loading...</div>
  
  return null
} 