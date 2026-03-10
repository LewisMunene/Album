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
    Loader2,
    Calendar,
    FileText,
    Smile
} from 'lucide-react'
import styles from './InvitePage.module.css'

type PageState = 'loading' | 'valid' | 'invalid' | 'expired' | 'used' | 'success'

interface PageProps {
    params: Promise<{ token: string }>
}

export default function AcceptInvitationPage({ params }: PageProps) {
    const router = useRouter()
    const { token } = use(params)

    const [pageState, setPageState] = useState<PageState>('loading')
    const [inviteData, setInviteData] = useState<{ email: string; invitedBy: string } | null>(null)

    // Account fields
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // Family member profile fields
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [nickname, setNickname] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [bio, setBio] = useState('')

    // UI state
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)

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

    const handleNextStep = () => {
        setError('')

        if (!firstName.trim()) {
            setError('Please enter your first name')
            return
        }
        if (!lastName.trim()) {
            setError('Please enter your last name')
            return
        }

        setCurrentStep(2)
    }

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
                body: JSON.stringify({
                    password,
                    firstName,
                    lastName,
                    nickname: nickname || null,
                    birthDate: birthDate || null,
                    bio: bio || null,
                }),
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
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <Loader2 className={styles.spinner} />
                    <p className={styles.loadingText}>Validating invitation...</p>
                </div>
            </div>
        )
    }

    // Invalid/expired/used states
    if (pageState !== 'valid' && pageState !== 'success') {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <div className={styles.errorIcon}>
                        <AlertCircle />
                    </div>
                    <h1 className={styles.errorTitle}>
                        {pageState === 'expired' && 'Invitation Expired'}
                        {pageState === 'used' && 'Invitation Already Used'}
                        {pageState === 'invalid' && 'Invitation Not Valid'}
                    </h1>
                    <p className={styles.errorDescription}>
                        {pageState === 'expired' && 'This invitation link has expired. Please ask for a new invitation.'}
                        {pageState === 'used' && 'This invitation has already been used to create an account.'}
                        {pageState === 'invalid' && 'Failed to validate invitation. Please try again.'}
                    </p>
                    <Link href="/" className={styles.homeLink}>
                        Return to Homepage
                    </Link>
                </div>
            </div>
        )
    }

    // Success state
    if (pageState === 'success') {
        return (
            <div className={styles.container}>
                <div className={styles.successState}>
                    <div className={styles.successIcon}>
                        <CheckCircle />
                    </div>
                    <h1 className={styles.successTitle}>Welcome to the Family!</h1>
                    <p className={styles.successDescription}>
                        Your account has been created successfully.
                    </p>
                    <p className={styles.successSubtext}>Redirecting to login...</p>
                </div>
            </div>
        )
    }

    // Valid invitation - show multi-step registration form
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.logoIcon}>
                        <Heart />
                    </div>
                    <h1 className={styles.title}>Join the Family Album</h1>
                    <p className={styles.subtitle}>
                        You&apos;ve been invited by {inviteData?.invitedBy}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className={styles.progressSteps}>
                    <div className={`${styles.stepCircle} ${currentStep >= 1 ? styles.stepCircleActive : styles.stepCircleInactive}`}>
                        1
                    </div>
                    <div className={`${styles.stepLine} ${currentStep >= 2 ? styles.stepLineActive : styles.stepLineInactive}`} />
                    <div className={`${styles.stepCircle} ${currentStep >= 2 ? styles.stepCircleActive : styles.stepCircleInactive}`}>
                        2
                    </div>
                </div>

                {/* Form Card */}
                <div className={styles.card}>
                    {/* Email Display */}
                    <div className={styles.emailSection}>
                        <label className={styles.label}>Email address</label>
                        <div className={styles.emailDisplay}>{inviteData?.email}</div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={styles.errorMessage}>
                            <AlertCircle />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Step 1: Profile Information */}
                    {currentStep === 1 && (
                        <div>
                            <p className={styles.stepText}>Step 1: Tell us about yourself</p>

                            {/* First Name & Last Name */}
                            <div className={styles.fieldRow}>
                                <div>
                                    <label className={styles.label}>First name *</label>
                                    <div className={styles.inputWrapper}>
                                        <User />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="First"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={styles.label}>Last name *</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Last"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Nickname */}
                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Nickname <span className={styles.labelOptional}>(optional)</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <Smile />
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="What does family call you?"
                                    />
                                </div>
                            </div>

                            {/* Birth Date */}
                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Date of birth <span className={styles.labelOptional}>(optional)</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <Calendar />
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Short bio <span className={styles.labelOptional}>(optional)</span>
                                </label>
                                <div className={`${styles.inputWrapper} ${styles.textareaWrapper}`}>
                                    <FileText />
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us a bit about yourself..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Next Button */}
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className={styles.primaryButton}
                            >
                                Continue to Password
                            </button>
                        </div>
                    )}

                    {/* Step 2: Password */}
                    {currentStep === 2 && (
                        <form onSubmit={handleSubmit}>
                            <p className={styles.stepText}>Step 2: Create your password</p>

                            {/* Welcome Box */}
                            <div className={styles.welcomeBox}>
                                <p>
                                    Welcome, <strong>{firstName} {lastName}</strong>
                                    {nickname && <span> ({nickname})</span>}!
                                </p>
                            </div>

                            {/* Password */}
                            <div className={styles.field}>
                                <label className={styles.label}>Password</label>
                                <div className={styles.inputWrapper}>
                                    <Lock />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={styles.passwordToggle}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                                <p className={styles.helperText}>Must be at least 6 characters</p>
                            </div>

                            {/* Confirm Password */}
                            <div className={styles.field}>
                                <label className={styles.label}>Confirm password</label>
                                <div className={styles.inputWrapper}>
                                    <Lock />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className={styles.buttonGroup}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                    className={styles.secondaryButton}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`${styles.primaryButton} ${styles.primaryButtonFlex}`}
                                >
                                    {isSubmitting ? (
                                        <span className={styles.buttonContent}>
                                            <Loader2 />
                                            Creating...
                                        </span>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className={styles.footer}>
                    Already have an account?{' '}
                    <Link href="/auth/login">Sign in</Link>
                </p>
            </div>
        </div>
    )
}