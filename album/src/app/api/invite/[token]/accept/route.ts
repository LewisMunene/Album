// src/app/api/invite/[token]/accept/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

interface RouteContext {
    params: Promise<{ token: string }>
}

export async function POST(
    request: Request,
    context: RouteContext
) {
    try {
        const { token } = await context.params
        const { name, password } = await request.json()

        // Validate input
        if (!name || !password) {
            return NextResponse.json(
                { error: 'Name and password are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        // Find and validate invitation
        const invitation = await prisma.invitation.findUnique({
            where: { token }
        })

        if (!invitation) {
            return NextResponse.json(
                { error: 'Invalid invitation' },
                { status: 404 }
            )
        }

        if (invitation.status === 'ACCEPTED') {
            return NextResponse.json(
                { error: 'This invitation has already been used' },
                { status: 400 }
            )
        }

        if (new Date() > invitation.expiresAt) {
            return NextResponse.json(
                { error: 'This invitation has expired' },
                { status: 400 }
            )
        }

        // Check if user already exists
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

        // Create user and update invitation in a transaction
        const [user] = await prisma.$transaction([
            prisma.user.create({
                data: {
                    name,
                    email: invitation.email,
                    password: hashedPassword,
                    role: 'MEMBER',
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            }),
            prisma.invitation.update({
                where: { id: invitation.id },
                data: {
                    status: 'ACCEPTED',
                    usedAt: new Date(),
                }
            })
        ])

        return NextResponse.json({
            message: 'Account created successfully',
            user
        }, { status: 201 })

    } catch (error) {
        console.error('Accept invitation error:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}