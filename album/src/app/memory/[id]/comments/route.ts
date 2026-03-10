// src/app/api/memories/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - List comments for a memory
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const comments = await prisma.comment.findMany({
            where: { memoryId: id },
            include: {
                author: {
                    select: { id: true, name: true, avatar: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ comments })

    } catch (error) {
        console.error('Get comments error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        )
    }
}

// POST - Add a comment to a memory
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { content } = body

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: 'Comment content is required' },
                { status: 400 }
            )
        }

        // Check if memory exists
        const memory = await prisma.memory.findUnique({
            where: { id }
        })

        if (!memory) {
            return NextResponse.json(
                { error: 'Memory not found' },
                { status: 404 }
            )
        }

        // Create the comment
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                memoryId: id,
                authorId: session.user.id
            },
            include: {
                author: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        })

        return NextResponse.json({
            success: true,
            comment: {
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt.toISOString(),
                author: comment.author
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Create comment error:', error)
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        )
    }
}