// src/app/api/albums/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET /api/albums/[id] - Get a single album with details
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

        const { id: albumId } = await params

        const album = await prisma.album.findUnique({
            where: { id: albumId },
            include: {
                createdBy: {
                    select: { id: true, name: true, avatar: true }
                },
                memories: {
                    include: {
                        memory: {
                            include: {
                                uploadedBy: {
                                    select: { id: true, name: true }
                                },
                                tags: {
                                    include: { tag: true }
                                }
                            }
                        }
                    },
                    orderBy: { order: 'asc' }
                },
                _count: {
                    select: { memories: true }
                }
            }
        })

        if (!album) {
            return NextResponse.json(
                { error: 'Album not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            id: album.id,
            name: album.name,
            description: album.description,
            coverImageUrl: album.coverImageUrl,
            isPublic: album.isPublic,
            createdAt: album.createdAt.toISOString(),
            createdBy: album.createdBy,
            memoryCount: album._count.memories,
            memories: album.memories.map(am => ({
                id: am.memory.id,
                title: am.memory.title,
                description: am.memory.description,
                type: am.memory.type,
                fileUrl: am.memory.fileUrl,
                thumbnailUrl: am.memory.thumbnailUrl,
                dateTaken: am.memory.dateTaken?.toISOString() || null,
                location: am.memory.location,
                uploadedBy: am.memory.uploadedBy,
                tags: am.memory.tags.map(t => t.tag.name)
            }))
        })
    } catch (error) {
        console.error('Error fetching album:', error)
        return NextResponse.json(
            { error: 'Failed to fetch album' },
            { status: 500 }
        )
    }
}

// PATCH /api/albums/[id] - Update an album
export async function PATCH(
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

        const { id: albumId } = await params
        const body = await request.json()
        const { name, description, coverImageUrl, isPublic } = body

        // Check if album exists and user owns it
        const existingAlbum = await prisma.album.findUnique({
            where: { id: albumId },
            select: { id: true, createdById: true }
        })

        if (!existingAlbum) {
            return NextResponse.json(
                { error: 'Album not found' },
                { status: 404 }
            )
        }

        // Check ownership (or admin role)
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        })

        if (existingAlbum.createdById !== session.user.id && user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'You do not have permission to edit this album' },
                { status: 403 }
            )
        }

        // Validate name if provided
        if (name !== undefined && (!name || typeof name !== 'string' || name.trim().length === 0)) {
            return NextResponse.json(
                { error: 'Album name cannot be empty' },
                { status: 400 }
            )
        }

        // Build update data
        const updateData: any = {}
        if (name !== undefined) updateData.name = name.trim()
        if (description !== undefined) updateData.description = description?.trim() || null
        if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl?.trim() || null
        if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic)

        const album = await prisma.album.update({
            where: { id: albumId },
            data: updateData,
            include: {
                createdBy: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        })

        return NextResponse.json({
            id: album.id,
            name: album.name,
            description: album.description,
            coverImageUrl: album.coverImageUrl,
            isPublic: album.isPublic,
            createdAt: album.createdAt.toISOString(),
            createdBy: album.createdBy
        })
    } catch (error) {
        console.error('Error updating album:', error)
        return NextResponse.json(
            { error: 'Failed to update album' },
            { status: 500 }
        )
    }
}

// DELETE /api/albums/[id] - Delete an album
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

        const { id: albumId } = await params

        // Check if album exists and user owns it
        const existingAlbum = await prisma.album.findUnique({
            where: { id: albumId },
            select: { id: true, createdById: true, name: true }
        })

        if (!existingAlbum) {
            return NextResponse.json(
                { error: 'Album not found' },
                { status: 404 }
            )
        }

        // Check ownership (or admin role)
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        })

        if (existingAlbum.createdById !== session.user.id && user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'You do not have permission to delete this album' },
                { status: 403 }
            )
        }

        // Delete album (this will cascade delete AlbumMemory entries due to schema)
        // The actual Memory records are NOT deleted, just the album associations
        await prisma.album.delete({
            where: { id: albumId }
        })

        return NextResponse.json({
            success: true,
            message: `Album "${existingAlbum.name}" has been deleted`
        })
    } catch (error) {
        console.error('Error deleting album:', error)
        return NextResponse.json(
            { error: 'Failed to delete album' },
            { status: 500 }
        )
    }
}