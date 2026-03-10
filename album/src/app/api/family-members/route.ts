// src/app/api/family-members/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Fetch all family members
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const members = await prisma.familyMember.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                nickname: true,
                profilePhoto: true,
                birthDate: true,
                generation: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                    }
                }
            },
            orderBy: [
                { generation: 'asc' },
                { firstName: 'asc' }
            ]
        })

        return NextResponse.json({ members })

    } catch (error) {
        console.error('Error fetching family members:', error)
        return NextResponse.json(
            { error: 'Failed to fetch family members' },
            { status: 500 }
        )
    }
}

// POST - Create a new family member (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        })

        if (user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Only admins can create family members directly' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { firstName, lastName, nickname, birthDate, deathDate, bio, generation, parentId, spouseId } = body

        if (!firstName || !lastName) {
            return NextResponse.json(
                { error: 'First name and last name are required' },
                { status: 400 }
            )
        }

        const member = await prisma.familyMember.create({
            data: {
                firstName,
                lastName,
                nickname,
                birthDate: birthDate ? new Date(birthDate) : null,
                deathDate: deathDate ? new Date(deathDate) : null,
                bio,
                generation: generation || 1,
                parentId,
                spouseId,
            }
        })

        return NextResponse.json({ member }, { status: 201 })

    } catch (error) {
        console.error('Error creating family member:', error)
        return NextResponse.json(
            { error: 'Failed to create family member' },
            { status: 500 }
        )
    }
}