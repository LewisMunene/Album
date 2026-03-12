// src/app/api/memories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { unlink } from 'fs/promises'
import path from 'path'

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET /api/memories/[id] - Get a single memory with details
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

        const { id: memoryId } = await params

        const memory = await prisma.memory.findUnique({
            where: { id: memoryId },
            include: {
                uploadedBy: {
                    select: { id: true, name: true, avatar: true }
                },
                tags: {
                    include: { tag: true }
                },
                albums: {
                    include: {
                        album: { select: { id: true, name: true } }
                    }
                },
                people: {
                    include: {
                        familyMember: {
                            select: { id: true, firstName: true, lastName: true, profilePhoto: true }
                        }
                    }
                },
                comments: {
                    include: {
                        author: { select: { id: true, name: true, avatar: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!memory) {
            return NextResponse.json(
                { error: 'Memory not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            id: memory.id,
            title: memory.title,
            description: memory.description,
            type: memory.type,
            fileUrl: memory.fileUrl,
            thumbnailUrl: memory.thumbnailUrl,
            dateTaken: memory.dateTaken?.toISOString() || null,
            location: memory.location,
            viewCount: memory.viewCount,
            createdAt: memory.createdAt.toISOString(),
            uploadedBy: memory.uploadedBy,
            tags: memory.tags.map(t => ({
                id: t.tag.id,
                name: t.tag.name,
                color: t.tag.color
            })),
            albums: memory.albums.map(a => ({
                id: a.album.id,
                name: a.album.name
            })),
            people: memory.people.map(p => ({
                id: p.familyMember.id,
                name: `${p.familyMember.firstName} ${p.familyMember.lastName}`,
                photo: p.familyMember.profilePhoto
            })),
            comments: memory.comments.map(c => ({
                id: c.id,
                content: c.content,
                createdAt: c.createdAt.toISOString(),
                author: c.author
            }))
        })
    } catch (error) {
        console.error('Error fetching memory:', error)
        return NextResponse.json(
            { error: 'Failed to fetch memory' },
            { status: 500 }
        )
    }
}

// PATCH /api/memories/[id] - Update a memory
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

        const { id: memoryId } = await params
        const body = await request.json()
        const { title, description, location, dateTaken, tagIds } = body

        // Check if memory exists and user owns it
        const existingMemory = await prisma.memory.findUnique({
            where: { id: memoryId },
            select: { id: true, uploadedById: true }
        })

        if (!existingMemory) {
            return NextResponse.json(
                { error: 'Memory not found' },
                { status: 404 }
            )
        }

        // Check ownership (or admin role)
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        })

        if (existingMemory.uploadedById !== session.user.id && user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'You do not have permission to edit this memory' },
                { status: 403 }
            )
        }

        // Validate title if provided
        if (title !== undefined && (!title || typeof title !== 'string' || title.trim().length === 0)) {
            return NextResponse.json(
                { error: 'Title cannot be empty' },
                { status: 400 }
            )
        }

        // Build update data
        const updateData: any = {}
        if (title !== undefined) updateData.title = title.trim()
        if (description !== undefined) updateData.description = description?.trim() || null
        if (location !== undefined) updateData.location = location?.trim() || null
        if (dateTaken !== undefined) updateData.dateTaken = dateTaken ? new Date(dateTaken) : null

        // Update memory
        const memory = await prisma.memory.update({
            where: { id: memoryId },
            data: updateData,
            include: {
                uploadedBy: {
                    select: { id: true, name: true, avatar: true }
                },
                tags: {
                    include: { tag: true }
                }
            }
        })

        // Update tags if provided
        if (tagIds !== undefined && Array.isArray(tagIds)) {
            // Remove existing tags
            await prisma.memoryTag.deleteMany({
                where: { memoryId }
            })

            // Add new tags
            if (tagIds.length > 0) {
                await prisma.memoryTag.createMany({
                    data: tagIds.map((tagId: string) => ({
                        memoryId,
                        tagId
                    }))
                })
            }

            // Fetch updated tags
            const updatedTags = await prisma.memoryTag.findMany({
                where: { memoryId },
                include: { tag: true }
            })

            return NextResponse.json({
                id: memory.id,
                title: memory.title,
                description: memory.description,
                location: memory.location,
                dateTaken: memory.dateTaken?.toISOString() || null,
                uploadedBy: memory.uploadedBy,
                tags: updatedTags.map(t => ({
                    id: t.tag.id,
                    name: t.tag.name,
                    color: t.tag.color
                }))
            })
        }

        return NextResponse.json({
            id: memory.id,
            title: memory.title,
            description: memory.description,
            location: memory.location,
            dateTaken: memory.dateTaken?.toISOString() || null,
            uploadedBy: memory.uploadedBy,
            tags: memory.tags.map(t => ({
                id: t.tag.id,
                name: t.tag.name,
                color: t.tag.color
            }))
        })
    } catch (error) {
        console.error('Error updating memory:', error)
        return NextResponse.json(
            { error: 'Failed to update memory' },
            { status: 500 }
        )
    }
}

// DELETE /api/memories/[id] - Delete a memory
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

        const { id: memoryId } = await params

        // Check if memory exists and user owns it
        const existingMemory = await prisma.memory.findUnique({
            where: { id: memoryId },
            select: { id: true, uploadedById: true, fileUrl: true, title: true }
        })

        if (!existingMemory) {
            return NextResponse.json(
                { error: 'Memory not found' },
                { status: 404 }
            )
        }

        // Check ownership (or admin role)
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        })

        if (existingMemory.uploadedById !== session.user.id && user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'You do not have permission to delete this memory' },
                { status: 403 }
            )
        }

        // Delete the memory (cascades to MemoryTag, AlbumMemory, Comment, MemoryPerson)
        await prisma.memory.delete({
            where: { id: memoryId }
        })

        // Try to delete the file (don't fail if it doesn't exist)
        if (existingMemory.fileUrl && existingMemory.fileUrl.startsWith('/uploads/')) {
            try {
                const filePath = path.join(process.cwd(), 'public', existingMemory.fileUrl)
                await unlink(filePath)
            } catch (fileError) {
                console.error('Error deleting file:', fileError)
                // Continue anyway - the DB record is deleted
            }
        }

        return NextResponse.json({
            success: true,
            message: `Memory "${existingMemory.title}" has been deleted`
        })
    } catch (error) {
        console.error('Error deleting memory:', error)
        return NextResponse.json(
            { error: 'Failed to delete memory' },
            { status: 500 }
        )
    }
}
