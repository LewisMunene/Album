// src/app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/tags - Fetch all tags
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const tags = await prisma.tag.findMany({
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(tags.map(tag => ({
            id: tag.id,
            name: tag.name,
            color: tag.color
        })))
    } catch (error) {
        console.error('Error fetching tags:', error)
        return NextResponse.json(
            { error: 'Failed to fetch tags' },
            { status: 500 }
        )
    }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, color } = body

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json(
                { error: 'Tag name is required' },
                { status: 400 }
            )
        }

        // Check if tag already exists
        const existingTag = await prisma.tag.findUnique({
            where: { name: name.trim() }
        })

        if (existingTag) {
            return NextResponse.json(
                { error: 'Tag already exists' },
                { status: 409 }
            )
        }

        const tag = await prisma.tag.create({
            data: {
                name: name.trim(),
                color: color?.trim() || null
            }
        })

        return NextResponse.json({
            id: tag.id,
            name: tag.name,
            color: tag.color
        }, { status: 201 })

    } catch (error) {
        console.error('Error creating tag:', error)
        return NextResponse.json(
            { error: 'Failed to create tag' },
            { status: 500 }
        )
    }
}