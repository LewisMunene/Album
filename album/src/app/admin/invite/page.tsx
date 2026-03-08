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
import styles from './AdminInvitePage.module.css'

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
        if (!dateString) return 'Unknown'
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'Unknown'
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const getStatusBadge = (inviteStatus: string) => {
        switch (inviteStatus) {
            case 'ACCEPTED':
                return <span className={`${styles.badge} ${styles.badgeAccepted}`}>Accepted</span>
            case 'EXPIRED':
                return <span className={`${styles.badge} ${styles.badgeExpired}`}>Expired</span>
            case 'REVOKED':
                return <span className={`${styles.badge} ${styles.badgeRevoked}`}>Revoked</span>
            default:
                return <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>
        }
    }

    if (status === 'loading') {
        return (
            <div className={styles.pageLoading}>
                <Loader2 />
            </div>
        )
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link href="/album" className={styles.backButton}>
                        <ArrowLeft />
                    </Link>
                    <div className={styles.headerTitle}>
                        <div className={styles.headerIcon}>
                            <Heart />
                        </div>
                        <span className={styles.headerText}>Invite Family</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Invite Form Card */}
                <div className={styles.inviteCard}>
                    <div className={styles.inviteCardHeader}>
                        <div className={styles.inviteCardIcon}>
                            <UserPlus />
                        </div>
                        <div className={styles.inviteCardContent}>
                            <h1>Invite a Family Member</h1>
                            <p>Send a magic link to their email. They'll be able to create an account and join the family album.</p>
                        </div>
                    </div>

                    {/* Success message */}
                    {success && (
                        <div className={`${styles.alert} ${styles.alertSuccess}`}>
                            <CheckCircle />
                            <p>{success}</p>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className={`${styles.alert} ${styles.alertError}`}>
                            <AlertCircle />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.inviteForm}>
                        <div className={styles.inputWrapper}>
                            <Mail />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="family.member@example.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.submitButton}
                        >
                            {isSubmitting ? <Loader2 /> : <Send />}
                            <span className={styles.submitButtonText}>
                                {isSubmitting ? 'Sending...' : 'Send Invite'}
                            </span>
                        </button>
                    </form>

                    <p className={styles.formHint}>
                        <Clock />
                        The invitation link will expire in 7 days
                    </p>
                </div>

                {/* Invitations List */}
                <div>
                    <div className={styles.listHeader}>
                        <div className={styles.listTitle}>
                            <Users />
                            <h2>Sent Invitations</h2>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className={styles.refreshButton}
                        >
                            <RefreshCw />
                        </button>
                    </div>

                    {loadingInvitations ? (
                        <div className={styles.loadingState}>
                            <Loader2 />
                            <p>Loading invitations...</p>
                        </div>
                    ) : invitations.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <Mail />
                            </div>
                            <h3>No invitations sent yet</h3>
                            <p>Invite your first family member above</p>
                        </div>
                    ) : (
                        <div className={styles.invitationList}>
                            {invitations.map((invitation) => (
                                <div key={invitation.id} className={styles.invitationItem}>
                                    <div className={styles.invitationInfo}>
                                        <div className={styles.invitationIcon}>
                                            <Mail />
                                        </div>
                                        <div className={styles.invitationDetails}>
                                            <h4>{invitation.email}</h4>
                                            <p className={styles.invitationMeta}>
                                                <Clock />
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