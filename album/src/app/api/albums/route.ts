// src/app/api/albums/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/albums - Fetch all albums
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const albums = await prisma.album.findMany({
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                memories: {
                    include: {
                        memory: {
                            select: {
                                id: true,
                                fileUrl: true,
                                thumbnailUrl: true
                            }
                        }
                    },
                    take: 4, // For preview images
                    orderBy: {
                        addedAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        memories: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Transform data for frontend
        const transformedAlbums = albums.map(album => ({
            id: album.id,
            name: album.name,
            description: album.description,
            coverImageUrl: album.coverImageUrl || album.memories[0]?.memory.fileUrl || null,
            memoryCount: album._count.memories,
            previewImages: album.memories.map(m => m.memory.thumbnailUrl || m.memory.fileUrl),
            createdBy: album.createdBy,
            createdAt: album.createdAt.toISOString()
        }))

        return NextResponse.json(transformedAlbums)
    } catch (error) {
        console.error('Error fetching albums:', error)
        return NextResponse.json(
            { error: 'Failed to fetch albums' },
            { status: 500 }
        )
    }
}

// POST /api/albums - Create a new album
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
        const { name, description } = body

        // Validate required fields
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json(
                { error: 'Album name is required' },
                { status: 400 }
            )
        }

        // Create the album
        const album = await prisma.album.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                createdById: session.user.id
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                _count: {
                    select: {
                        memories: true
                    }
                }
            }
        })

        return NextResponse.json({
            id: album.id,
            name: album.name,
            description: album.description,
            coverImageUrl: null,
            memoryCount: 0,
            previewImages: [],
            createdBy: album.createdBy,
            createdAt: album.createdAt.toISOString()
        }, { status: 201 })

    } catch (error) {
        console.error('Error creating album:', error)
        return NextResponse.json(
            { error: 'Failed to create album' },
            { status: 500 }
        )
    }
}