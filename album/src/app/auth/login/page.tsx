// src/app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import styles from './LoginPage.module.css'

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
    <div className={styles.page}>
      {/* Left Panel - Decorative */}
      <div className={styles.leftPanel}>
        {/* Decorative circles */}
        <div className={`${styles.decorCircle} ${styles.decorCircle1}`} />
        <div className={`${styles.decorCircle} ${styles.decorCircle2}`} />
        <div className={`${styles.decorCircle} ${styles.decorCircle3}`} />

        {/* Content */}
        <div className={styles.leftContent}>
          <div className={styles.leftLogo}>
            <div className={styles.leftLogoIcon}>
              <Heart />
            </div>
            <span className={styles.leftLogoText}>Muthee Family</span>
          </div>

          <h1 className={styles.leftTitle}>
            Every photo tells<br />
            a story worth<br />
            <span className={styles.leftTitleFaded}>keeping.</span>
          </h1>

          <p className={styles.leftDescription}>
            Join our family album and preserve memories that will last for generations.
          </p>
        </div>

        {/* Floating polaroids */}
        <div className={`${styles.floatingPolaroid} ${styles.floatingPolaroid1}`} />
        <div className={`${styles.floatingPolaroid} ${styles.floatingPolaroid2}`} />
      </div>

      {/* Right Panel - Login Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          {/* Mobile logo */}
          <div className={styles.mobileLogo}>
            <div className={styles.mobileLogoIcon}>
              <Heart />
            </div>
            <span className={styles.mobileLogoText}>Muthee Family</span>
          </div>

          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSubtitle}>Sign in to access the family album</p>

          {/* Error message */}
          {error && (
            <div className={`${styles.alert} ${styles.alertError}`}>
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className={styles.forgotPassword}>
              <Link href="/auth/forgot-password" className={styles.forgotPasswordLink}>
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? (
                <>
                  <Loader2 />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>



        </div>
      </div>
    </div>
  )
}