// src/app/auth/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import styles from './RegisterPage.module.css'

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
        <div className={styles.page}>
            {/* Left Panel - Decorative */}
            <div className={styles.leftPanel}>
                {/* Decorative circles */}
                <div className={`${styles.decorCircle} ${styles.decorCircle1}`} />
                <div className={`${styles.decorCircle} ${styles.decorCircle2}`} />

                {/* Content */}
                <div className={styles.leftContent}>
                    <div className={styles.leftLogo}>
                        <div className={styles.leftLogoIcon}>
                            <Heart />
                        </div>
                        <span className={styles.leftLogoText}>Muthee Family</span>
                    </div>

                    <h1 className={styles.leftTitle}>
                        Start preserving<br />
                        your precious<br />
                        <span className={styles.leftTitleFaded}>memories.</span>
                    </h1>

                    <p className={styles.leftDescription}>
                        Create an account and join the family album to share moments that matter.
                    </p>
                </div>

                {/* Floating polaroid */}
                <div className={styles.floatingPolaroid} />
            </div>

            {/* Right Panel - Register Form */}
            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    {/* Mobile logo */}
                    <div className={styles.mobileLogo}>
                        <div className={styles.mobileLogoIcon}>
                            <Heart />
                        </div>
                        <span className={styles.mobileLogoText}>Muthee Family</span>
                    </div>

                    <h2 className={styles.formTitle}>Join the family</h2>
                    <p className={styles.formSubtitle}>Create an account to start preserving memories</p>

                    {/* Success message */}
                    {success && (
                        <div className={`${styles.alert} ${styles.alertSuccess}`}>
                            <CheckCircle size={20} />
                            <p>Account created! Redirecting to login...</p>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className={`${styles.alert} ${styles.alertError}`}>
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Name */}
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Full name</label>
                            <div className={styles.inputWrapper}>
                                <User />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Muthee"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Email address</label>
                            <div className={styles.inputWrapper}>
                                <Mail />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Password</label>
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
                                    className={styles.togglePassword}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <span className={styles.inputHint}>Must be at least 6 characters</span>
                        </div>

                        {/* Confirm Password */}
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Confirm password</label>
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

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className={styles.submitButton}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 />
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    {/* Sign in link */}
                    <p className={styles.footerText}>
                        Already have an account?{' '}
                        <Link href="/auth/login" className={styles.footerLink}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}