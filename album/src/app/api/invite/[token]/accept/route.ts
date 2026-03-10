// src/app/api/invite/[token]/accept/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

interface AcceptInvitationBody {
    password: string
    firstName: string
    lastName: string
    nickname?: string | null
    birthDate?: string | null
    bio?: string | null
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params
        const body: AcceptInvitationBody = await request.json()

        const { password, firstName, lastName, nickname, birthDate, bio } = body

        // Validate required fields
        if (!password || password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        if (!firstName || !lastName) {
            return NextResponse.json(
                { error: 'First name and last name are required' },
                { status: 400 }
            )
        }

        // Find the invitation
        const invitation = await prisma.invitation.findUnique({
            where: { token },
            include: { invitedBy: true }
        })

        if (!invitation) {
            return NextResponse.json(
                { error: 'Invalid invitation' },
                { status: 404 }
            )
        }

        // Check if already used
        if (invitation.status === 'ACCEPTED') {
            return NextResponse.json(
                { error: 'This invitation has already been used' },
                { status: 400 }
            )
        }

        // Check if expired
        if (invitation.expiresAt < new Date()) {
            // Update status to expired
            await prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: 'EXPIRED' }
            })
            return NextResponse.json(
                { error: 'This invitation has expired' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: invitation.email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user AND family member in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the user
            const user = await tx.user.create({
                data: {
                    email: invitation.email,
                    name: `${firstName} ${lastName}`,
                    password: hashedPassword,
                    role: 'MEMBER',
                }
            })

            // 2. Create the linked family member
            const familyMember = await tx.familyMember.create({
                data: {
                    firstName,
                    lastName,
                    nickname: nickname || null,
                    birthDate: birthDate ? new Date(birthDate) : null,
                    bio: bio || null,
                    userId: user.id,
                    generation: 1, // Default generation, can be updated later
                }
            })

            // 3. Mark invitation as accepted
            await tx.invitation.update({
                where: { id: invitation.id },
                data: {
                    status: 'ACCEPTED',
                    usedAt: new Date()
                }
            })

            return { user, familyMember }
        })

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
            },
            familyMember: {
                id: result.familyMember.id,
                firstName: result.familyMember.firstName,
                lastName: result.familyMember.lastName,
            }
        })

    } catch (error) {
        console.error('Accept invitation error:', error)
        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        )
    }
}