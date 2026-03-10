// src/app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Fetch all tags
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const tags = await prisma.tag.findMany({
            select: {
                id: true,
                name: true,
                color: true,
                _count: {
                    select: {
                        memories: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json({
            tags: tags.map(t => ({
                id: t.id,
                name: t.name,
                color: t.color,
                memoryCount: t._count.memories
            }))
        })

    } catch (error) {
        console.error('Error fetching tags:', error)
        return NextResponse.json(
            { error: 'Failed to fetch tags' },
            { status: 500 }
        )
    }
}

// POST - Create a new tag
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, color } = body

        if (!name) {
            return NextResponse.json(
                { error: 'Tag name is required' },
                { status: 400 }
            )
        }

        // Check if tag already exists
        const existing = await prisma.tag.findUnique({
            where: { name: name.toLowerCase().trim() }
        })

        if (existing) {
            return NextResponse.json(
                { error: 'Tag already exists', tag: existing },
                { status: 409 }
            )
        }

        const tag = await prisma.tag.create({
            data: {
                name: name.toLowerCase().trim(),
                color: color || null,
            }
        })

        return NextResponse.json({ tag }, { status: 201 })

    } catch (error) {
        console.error('Error creating tag:', error)
        return NextResponse.json(
            { error: 'Failed to create tag' },
            { status: 500 }
        )
    }
}