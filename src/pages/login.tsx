import React from 'react'
import { useNavigate } from 'react-router-dom'

import { signInWithGoogle } from '@/firebaseconfig'

const LoginPage = () => {
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await signInWithGoogle()
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  )
}

export default LoginPage
