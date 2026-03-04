// src/app/auth/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            setSuccess(true)

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/auth/login')
            }, 2000)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
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
                        Start preserving
                        <br />
                        your precious
                        <br />
                        <span style={{ opacity: 0.8 }}>memories.</span>
                    </h1>

                    <p className="text-white/80 text-lg max-w-md">
                        Create an account and join the family album to share moments that matter.
                    </p>

                    {/* Floating polaroids */}
                    <div
                        className="absolute bottom-[15%] right-[15%] w-28 h-36 rounded-lg"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            transform: 'rotate(6deg)'
                        }}
                    />
                </div>
            </div>

            {/* Right Panel - Register Form */}
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

                    <h2 className="font-display text-3xl font-semibold mb-2">Join the family</h2>
                    <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
                        Create an account to start preserving memories
                    </p>

                    {/* Success message */}
                    {success && (
                        <div
                            className="flex items-center gap-3 p-4 rounded-lg mb-6"
                            style={{ backgroundColor: '#D1FAE5', color: '#059669' }}
                        >
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">Account created! Redirecting to login...</p>
                        </div>
                    )}

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
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Full name
                            </label>
                            <div
                                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                style={{
                                    backgroundColor: 'var(--color-card)',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                <User className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Muthee"
                                    className="flex-1 bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>

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
                                    minLength={6}
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
                            <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
                                Must be at least 6 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Confirm password
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
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="flex-1 bg-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className="w-full py-3.5 rounded-xl text-white font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                                boxShadow: '0 4px 14px rgba(196, 149, 106, 0.3)'
                            }}
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    {/* Sign in link */}
                    <p className="text-center mt-8" style={{ color: 'var(--color-text-muted)' }}>
                        Already have an account?{' '}
                        <Link
                            href="/auth/login"
                            className="font-medium"
                            style={{ color: 'var(--color-accent)' }}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}