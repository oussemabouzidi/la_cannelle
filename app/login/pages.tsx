'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const email = (form.email as HTMLInputElement).value
    const password = (form.password as HTMLInputElement).value

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    setLoading(false)

    if (!res.ok) {
      setError('Invalid credentials')
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h1>Admin Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
