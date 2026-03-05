// src/lib/invitation.ts
import crypto from 'crypto'

/**
 * Generate a secure random token for invitations
 * Using 32 bytes = 256 bits of entropy, URL-safe base64 encoded
 */
export function generateInviteToken(): string {
    return crypto.randomBytes(32).toString('base64url')
}

/**
 * Calculate expiration date for invitation
 * Default: 7 days from now
 */
export function getInviteExpiration(days: number = 7): Date {
    const expiration = new Date()
    expiration.setDate(expiration.getDate() + days)
    return expiration
}

/**
 * Check if an invitation token has expired
 */
export function isInviteExpired(expiresAt: Date): boolean {
    return new Date() > new Date(expiresAt)
}

/**
 * Format expiration time for display
 */
export function formatExpirationTime(expiresAt: Date): string {
    const now = new Date()
    const diff = new Date(expiresAt).getTime() - now.getTime()

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''}`
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`
    } else {
        return 'less than an hour'
    }
}

/**
 * Build the full invitation URL
 */
export function buildInviteUrl(token: string, baseUrl?: string): string {
    const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return `${base}/invite/${token}`
}