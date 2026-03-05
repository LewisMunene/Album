// src/app/admin/invite/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Heart,
    Mail,
    Send,
    AlertCircle,
    CheckCircle,
    Loader2,
    ArrowLeft,
    Clock,
    UserPlus,
    RefreshCw,
    Users
} from 'lucide-react'

interface Invitation {
    id: string
    email: string
    status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED'
    expiresAt: string
    createdAt: string
    invitedBy: {
        name: string
        email: string
    }
}

export default function AdminInvitePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [loadingInvitations, setLoadingInvitations] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login')
        }
    }, [status, router])

    useEffect(() => {
        async function fetchInvitations() {
            try {
                const response = await fetch('/api/admin/invite')
                if (response.ok) {
                    const data = await response.json()
                    setInvitations(data.invitations)
                }
            } catch (error) {
                console.error('Failed to fetch invitations:', error)
            } finally {
                setLoadingInvitations(false)
            }
        }

        if (status === 'authenticated') {
            fetchInvitations()
        }
    }, [status])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!email.trim()) {
            setError('Please enter an email address')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/admin/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send invitation')
            }

            setSuccess(`Invitation sent to ${email}!`)
            setEmail('')

            if (data.invitation) {
                setInvitations(prev => [
                    {
                        ...data.invitation,
                        invitedBy: { name: session?.user?.name || '', email: session?.user?.email || '' }
                    },
                    ...prev
                ])
            }

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const getStatusBadge = (inviteStatus: string) => {
        switch (inviteStatus) {
            case 'ACCEPTED':
                return <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Accepted</span>
            case 'EXPIRED':
                return <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">Expired</span>
            case 'REVOKED':
                return <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">Revoked</span>
            default:
                return <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
                <Loader2 className="w-8 h-8 animate-spin text-[#C4956A]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDF8F3]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#FDF8F3]/95 backdrop-blur-md border-b border-[#E8DDD0]">
                <div className="max-w-2xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/album"
                            className="p-2.5 rounded-xl bg-[#F5EDE4] hover:bg-[#E8DDD0] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#8B7355]" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#C4956A] to-[#A67B4F] shadow-lg shadow-[#C4956A]/30">
                                <Heart className="w-5 h-5 text-white fill-white" />
                            </div>
                            <span className="font-display text-xl font-semibold text-[#3D3229]">
                                Invite Family
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-6 py-10">
                {/* Invite Form Card */}
                <div className="p-8 rounded-2xl mb-10 bg-white border border-[#E8DDD0] shadow-[0_4px_24px_rgba(61,50,41,0.08)]">
                    <div className="flex items-start gap-5 mb-8">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#C4956A] to-[#A67B4F] shadow-lg shadow-[#C4956A]/35">
                            <UserPlus className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-semibold mb-2 text-[#3D3229]">
                                Invite a Family Member
                            </h1>
                            <p className="text-[#8B7355] leading-relaxed">
                                Send a magic link to their email. They'll be able to create an account and join the family album.
                            </p>
                        </div>
                    </div>

                    {/* Success message */}
                    {success && (
                        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 bg-green-50 border border-green-200">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
                            <p className="text-sm font-medium text-green-600">{success}</p>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 bg-red-50 border border-red-200">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                            <p className="text-sm font-medium text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-3">
                            <div className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#FDF8F3] border-2 border-[#E8DDD0] focus-within:border-[#C4956A] transition-colors">
                                <Mail className="w-5 h-5 flex-shrink-0 text-[#8B7355]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="family.member@example.com"
                                    className="flex-1 bg-transparent outline-none text-base text-[#3D3229] placeholder:text-[#8B7355]/60"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3.5 rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2 bg-gradient-to-br from-[#C4956A] to-[#A67B4F] shadow-lg shadow-[#C4956A]/40"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                <span className="hidden sm:inline">{isSubmitting ? 'Sending...' : 'Send Invite'}</span>
                            </button>
                        </div>
                        <p className="text-sm mt-4 flex items-center gap-2 text-[#8B7355]">
                            <Clock className="w-4 h-4" />
                            The invitation link will expire in 7 days
                        </p>
                    </form>
                </div>

                {/* Invitations List */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-[#C4956A]" />
                            <h2 className="font-display text-xl font-semibold text-[#3D3229]">
                                Sent Invitations
                            </h2>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="p-2.5 rounded-xl bg-[#F5EDE4] hover:bg-[#E8DDD0] transition-colors"
                        >
                            <RefreshCw className="w-4 h-4 text-[#8B7355]" />
                        </button>
                    </div>

                    {loadingInvitations ? (
                        <div className="text-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#C4956A]" />
                            <p className="text-[#8B7355]">Loading invitations...</p>
                        </div>
                    ) : invitations.length === 0 ? (
                        <div className="text-center py-16 rounded-2xl bg-white border border-[#E8DDD0] shadow-[0_4px_24px_rgba(61,50,41,0.08)]">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#F5EDE4]">
                                <Mail className="w-8 h-8 text-[#8B7355]" />
                            </div>
                            <p className="font-medium mb-1 text-[#3D3229]">No invitations sent yet</p>
                            <p className="text-sm text-[#8B7355]">
                                Invite your first family member above
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {invitations.map((invitation) => (
                                <div
                                    key={invitation.id}
                                    className="flex items-center justify-between p-5 rounded-xl bg-white border border-[#E8DDD0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#F5EDE4]">
                                            <Mail className="w-5 h-5 text-[#C4956A]" />
                                        </div>
                                        <div>
                                            <p className="font-medium mb-1 text-[#3D3229]">
                                                {invitation.email}
                                            </p>
                                            <p className="text-sm flex items-center gap-1.5 text-[#8B7355]">
                                                <Clock className="w-3.5 h-3.5" />
                                                Sent {formatDate(invitation.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(invitation.status)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}