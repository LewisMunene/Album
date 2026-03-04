// src/app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/album'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Left Panel - Decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-accent)' }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-[10%] left-[10%] w-40 h-40 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        />
        <div
          className="absolute bottom-[20%] right-[5%] w-56 h-56 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-white text-xl font-display font-semibold">
              Muthee Family
            </span>
          </div>

          <h1 className="font-display text-4xl xl:text-5xl text-white font-semibold leading-tight mb-6">
            Every photo tells
            <br />
            a story worth
            <br />
            <span style={{ opacity: 0.8 }}>keeping.</span>
          </h1>

          <p className="text-white/80 text-lg max-w-md">
            Join our family album and preserve memories that will last for generations.
          </p>

          {/* Floating polaroids */}
          <div
            className="absolute bottom-[15%] right-[15%] w-28 h-36 rounded-lg"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              transform: 'rotate(6deg)'
            }}
          />
          <div
            className="absolute bottom-[25%] right-[30%] w-24 h-28 rounded-lg"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              transform: 'rotate(-4deg)'
            }}
          />
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display text-lg font-semibold">Muthee Family</span>
          </div>

          <h2 className="font-display text-3xl font-semibold mb-2">Welcome back</h2>
          <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
            Sign in to access the family album
          </p>

          {/* Error message */}
          {error && (
            <div
              className="flex items-center gap-3 p-4 rounded-lg mb-6"
              style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email address
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <Mail className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <Lock className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium"
                style={{ color: 'var(--color-accent)' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                boxShadow: '0 4px 14px rgba(196, 149, 106, 0.3)'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center mt-8" style={{ color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="font-medium"
              style={{ color: 'var(--color-accent)' }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}