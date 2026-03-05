// src/app/api/admin/invite/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateInviteToken, getInviteExpiration, buildInviteUrl, formatExpirationTime } from '@/lib/invitation'
import { sendInvitationEmail } from '@/lib/email'

export async function POST(request: Request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'You must be logged in to send invitations' },
                { status: 401 }
            )
        }

        // Get the current user and check if they're an admin
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, name: true, role: true }
        })

        if (!currentUser || currentUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Only administrators can send invitations' },
                { status: 403 }
            )
        }

        // Parse request body
        const { email } = await request.json()

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email address is required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'A user with this email already exists' },
                { status: 400 }
            )
        }

        // Check for pending invitations to this email
        const existingInvite = await prisma.invitation.findFirst({
            where: {
                email: email.toLowerCase(),
                status: 'PENDING',
                expiresAt: { gt: new Date() }
            }
        })

        if (existingInvite) {
            return NextResponse.json(
                { error: 'An invitation has already been sent to this email. You can resend it from the invitations list.' },
                { status: 400 }
            )
        }

        // Generate invitation
        const token = generateInviteToken()
        const expiresAt = getInviteExpiration(7) // 7 days
        const inviteLink = buildInviteUrl(token)

        // Create invitation record
        const invitation = await prisma.invitation.create({
            data: {
                email: email.toLowerCase(),
                token,
                expiresAt,
                invitedById: currentUser.id,
            }
        })

        // Send invitation email
        const emailResult = await sendInvitationEmail({
            to: email.toLowerCase(),
            inviterName: currentUser.name || 'A family member',
            inviteLink,
            expiresIn: formatExpirationTime(expiresAt),
        })

        if (!emailResult.success) {
            // If email fails, delete the invitation record
            await prisma.invitation.delete({ where: { id: invitation.id } })

            return NextResponse.json(
                { error: 'Failed to send invitation email. Please try again.' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: `Invitation sent to ${email}`,
            invitation: {
                id: invitation.id,
                email: invitation.email,
                expiresAt: invitation.expiresAt,
                status: invitation.status,
            }
        })

    } catch (error) {
        console.error('Invitation error:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}

// GET - List all invitations (for admin dashboard)
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, role: true }
        })

        if (!currentUser || currentUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        const invitations = await prisma.invitation.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                invitedBy: {
                    select: { name: true, email: true }
                }
            }
        })

        // Update status for expired invitations
        const now = new Date()
        const updatedInvitations = invitations.map(inv => ({
            ...inv,
            status: inv.status === 'PENDING' && inv.expiresAt < now ? 'EXPIRED' : inv.status
        }))

        return NextResponse.json({ invitations: updatedInvitations })

    } catch (error) {
        console.error('Error fetching invitations:', error)
        return NextResponse.json(
            { error: 'Failed to fetch invitations' },
            { status: 500 }
        )
    }
}