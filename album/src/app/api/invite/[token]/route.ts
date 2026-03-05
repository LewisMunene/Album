// src/app/api/invite/[token]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface RouteContext {
    params: Promise<{ token: string }>
}

export async function GET(
    request: Request,
    context: RouteContext
) {
    try {
        const { token } = await context.params

        const invitation = await prisma.invitation.findUnique({
            where: { token },
            include: {
                invitedBy: {
                    select: { name: true }
                }
            }
        })

        if (!invitation) {
            return NextResponse.json(
                { valid: false, reason: 'not_found' },
                { status: 404 }
            )
        }

        // Check if already used
        if (invitation.status === 'ACCEPTED') {
            return NextResponse.json(
                { valid: false, reason: 'used' },
                { status: 400 }
            )
        }

        // Check if expired
        if (new Date() > invitation.expiresAt) {
            // Update status to expired
            await prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: 'EXPIRED' }
            })

            return NextResponse.json(
                { valid: false, reason: 'expired' },
                { status: 400 }
            )
        }

        // Check if revoked
        if (invitation.status === 'REVOKED') {
            return NextResponse.json(
                { valid: false, reason: 'revoked' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            valid: true,
            email: invitation.email,
            invitedBy: invitation.invitedBy.name
        })

    } catch (error) {
        console.error('Token validation error:', error)
        return NextResponse.json(
            { valid: false, reason: 'error' },
            { status: 500 }
        )
    }
}