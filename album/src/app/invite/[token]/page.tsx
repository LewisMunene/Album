// src/app/invite/[token]/page.tsx
'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Heart,
    User,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle,
    Loader2
} from 'lucide-react'

type PageState = 'loading' | 'valid' | 'invalid' | 'expired' | 'used' | 'success'

interface PageProps {
    params: Promise<{ token: string }>
}

export default function AcceptInvitationPage({ params }: PageProps) {
    const router = useRouter()
    // Unwrap params with React.use()
    const { token } = use(params)

    const [pageState, setPageState] = useState<PageState>('loading')
    const [inviteData, setInviteData] = useState<{ email: string; invitedBy: string } | null>(null)

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Validate token on mount
    useEffect(() => {
        async function validateToken() {
            try {
                const response = await fetch(`/api/invite/${token}`)
                const data = await response.json()

                if (response.ok && data.valid) {
                    setInviteData({ email: data.email, invitedBy: data.invitedBy })
                    setPageState('valid')
                } else if (data.reason === 'expired') {
                    setPageState('expired')
                } else if (data.reason === 'used') {
                    setPageState('used')
                } else {
                    setPageState('invalid')
                }
            } catch (err) {
                setPageState('invalid')
            }
        }

        validateToken()
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/invite/${token}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create account')
            }

            setPageState('success')
            setTimeout(() => {
                router.push('/auth/login')
            }, 2000)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Loading state
    if (pageState === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-[#C4956A]" />
                    <p className="text-[#8B7355]">Validating invitation...</p>
                </div>
            </div>
        )
    }

    // Invalid/expired/used states
    if (pageState !== 'valid' && pageState !== 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-100">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="font-display text-2xl font-semibold mb-3 text-[#3D3229]">
                        {pageState === 'expired' && 'Invitation Expired'}
                        {pageState === 'used' && 'Invitation Already Used'}
                        {pageState === 'invalid' && 'Invitation Not Valid'}
                    </h1>
                    <p className="text-[#8B7355] mb-6">
                        {pageState === 'expired' && 'This invitation link has expired. Please ask for a new invitation.'}
                        {pageState === 'used' && 'This invitation has already been used to create an account.'}
                        {pageState === 'invalid' && 'Failed to validate invitation. Please try again.'}
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 rounded-xl font-medium text-[#C4956A] border-2 border-[#C4956A] hover:bg-[#C4956A] hover:text-white transition-colors"
                    >
                        Return to Homepage
                    </Link>
                </div>
            </div>
        )
    }

    // Success state
    if (pageState === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-100">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="font-display text-2xl font-semibold mb-3 text-[#3D3229]">
                        Welcome to the Family!
                    </h1>
                    <p className="text-[#8B7355] mb-2">
                        Your account has been created successfully.
                    </p>
                    <p className="text-sm text-[#8B7355]">
                        Redirecting to login...
                    </p>
                </div>
            </div>
        )
    }

    // Valid invitation - show registration form
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-6 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-[#C4956A] to-[#A67B4F] shadow-lg shadow-[#C4956A]/30">
                        <Heart className="w-7 h-7 text-white fill-white" />
                    </div>
                    <h1 className="font-display text-2xl font-semibold mb-2 text-[#3D3229]">
                        Join the Family Album
                    </h1>
                    <p className="text-[#8B7355]">
                        You've been invited to join by {inviteData?.invitedBy}
                    </p>
                </div>

                {/* Form Card */}
                <div className="p-8 rounded-2xl bg-white border border-[#E8DDD0] shadow-[0_4px_24px_rgba(61,50,41,0.08)]">
                    {/* Email (read-only) */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-[#3D3229]">
                            Email address
                        </label>
                        <div className="px-4 py-3.5 rounded-xl bg-[#F5EDE4] border border-[#E8DDD0] text-[#8B7355]">
                            {inviteData?.email}
                        </div>
                        <p className="text-xs mt-1.5 text-[#8B7355]">
                            This email was used for your invitation
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 bg-red-50 border border-red-200">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                            <p className="text-sm font-medium text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2 text-[#3D3229]">
                                Full name
                            </label>
                            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#FDF8F3] border-2 border-[#E8DDD0] focus-within:border-[#C4956A] transition-colors">
                                <User className="w-5 h-5 text-[#8B7355]" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    className="flex-1 bg-transparent outline-none text-[#3D3229] placeholder:text-[#8B7355]/60"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2 text-[#3D3229]">
                                Password
                            </label>
                            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#FDF8F3] border-2 border-[#E8DDD0] focus-within:border-[#C4956A] transition-colors">
                                <Lock className="w-5 h-5 text-[#8B7355]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="flex-1 bg-transparent outline-none text-[#3D3229] placeholder:text-[#8B7355]/60"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-[#8B7355] hover:text-[#3D3229]"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-xs mt-1.5 text-[#8B7355]">
                                Must be at least 6 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-[#3D3229]">
                                Confirm password
                            </label>
                            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#FDF8F3] border-2 border-[#E8DDD0] focus-within:border-[#C4956A] transition-colors">
                                <Lock className="w-5 h-5 text-[#8B7355]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="flex-1 bg-transparent outline-none text-[#3D3229] placeholder:text-[#8B7355]/60"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 bg-gradient-to-br from-[#C4956A] to-[#A67B4F] shadow-lg shadow-[#C4956A]/40"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center mt-6 text-sm text-[#8B7355]">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="font-medium text-[#C4956A] hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}