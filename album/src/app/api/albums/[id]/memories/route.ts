// src/app/api/albums/[id]/memories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET /api/albums/[id]/memories - Get all memories NOT in this album (for adding)
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Await params in Next.js 15
        const { id: albumId } = await params

        if (!albumId) {
            return NextResponse.json(
                { error: 'Album ID is required' },
                { status: 400 }
            )
        }

        // Get all memory IDs already in this album
        const existingMemories = await prisma.albumMemory.findMany({
            where: { albumId },
            select: { memoryId: true }
        })
        const existingMemoryIds = existingMemories.map(m => m.memoryId)

        // Get all memories NOT in this album
        const availableMemories = await prisma.memory.findMany({
            where: existingMemoryIds.length > 0
                ? { id: { notIn: existingMemoryIds } }
                : {},
            include: {
                uploadedBy: {
                    select: { id: true, name: true }
                },
                tags: {
                    include: { tag: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(availableMemories.map(memory => ({
            id: memory.id,
            title: memory.title,
            description: memory.description,
            type: memory.type,
            fileUrl: memory.fileUrl,
            thumbnailUrl: memory.thumbnailUrl,
            dateTaken: memory.dateTaken?.toISOString() || null,
            location: memory.location,
            uploadedBy: memory.uploadedBy,
            tags: memory.tags.map(t => t.tag.name)
        })))
    } catch (error) {
        console.error('Error fetching available memories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch memories' },
            { status: 500 }
        )
    }
}

// POST /api/albums/[id]/memories - Add memories to album
export async function POST(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Await params in Next.js 15
        const { id: albumId } = await params

        if (!albumId) {
            return NextResponse.json(
                { error: 'Album ID is required' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { memoryIds } = body

        if (!Array.isArray(memoryIds) || memoryIds.length === 0) {
            return NextResponse.json(
                { error: 'At least one memory ID is required' },
                { status: 400 }
            )
        }

        // Verify album exists
        const album = await prisma.album.findUnique({
            where: { id: albumId }
        })

        if (!album) {
            return NextResponse.json(
                { error: 'Album not found' },
                { status: 404 }
            )
        }

        // Get current max order
        const maxOrder = await prisma.albumMemory.aggregate({
            where: { albumId },
            _max: { order: true }
        })
        let nextOrder = (maxOrder._max.order || 0) + 1

        // Add memories to album (skip duplicates)
        const results = await Promise.all(
            memoryIds.map(async (memoryId: string, index: number) => {
                try {
                    return await prisma.albumMemory.create({
                        data: {
                            albumId,
                            memoryId,
                            order: nextOrder + index
                        }
                    })
                } catch (e) {
                    // Skip if already exists (unique constraint)
                    return null
                }
            })
        )

        const addedCount = results.filter(r => r !== null).length

        return NextResponse.json({
            success: true,
            message: `Added ${addedCount} memories to album`,
            addedCount
        })
    } catch (error) {
        console.error('Error adding memories to album:', error)
        return NextResponse.json(
            { error: 'Failed to add memories to album' },
            { status: 500 }
        )
    }
}

// DELETE /api/albums/[id]/memories?memoryId=xxx - Remove a memory from album
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Await params in Next.js 15
        const { id: albumId } = await params

        if (!albumId) {
            return NextResponse.json(
                { error: 'Album ID is required' },
                { status: 400 }
            )
        }

        const { searchParams } = new URL(request.url)
        const memoryId = searchParams.get('memoryId')

        if (!memoryId) {
            return NextResponse.json(
                { error: 'Memory ID is required' },
                { status: 400 }
            )
        }

        await prisma.albumMemory.delete({
            where: {
                albumId_memoryId: {
                    albumId,
                    memoryId
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Memory removed from album'
        })
    } catch (error) {
        console.error('Error removing memory from album:', error)
        return NextResponse.json(
            { error: 'Failed to remove memory from album' },
            { status: 500 }
        )
    }
}