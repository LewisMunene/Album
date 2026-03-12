// src/app/api/memories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Helper to determine memory type from file
function getMemoryType(mimeType: string): 'PHOTO' | 'VIDEO' | 'STORY' {
    if (mimeType.startsWith('video/')) return 'VIDEO'
    if (mimeType.startsWith('image/')) return 'PHOTO'
    return 'STORY'
}

// Helper to generate unique filename
function generateFilename(originalName: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = path.extname(originalName)
    const name = path.basename(originalName, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .substring(0, 50)
    return `${name}-${timestamp}-${random}${ext}`
}

// GET /api/memories - Fetch all memories
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        const memories = await prisma.memory.findMany({
            include: {
                uploadedBy: {
                    select: { id: true, name: true, avatar: true }
                },
                tags: {
                    include: { tag: true }
                },
                people: {
                    include: {
                        familyMember: {
                            select: { id: true, firstName: true, lastName: true, profilePhoto: true }
                        }
                    }
                },
                albums: {
                    include: {
                        album: {
                            select: { id: true, name: true }
                        }
                    }
                },
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset
        })

        return NextResponse.json(memories.map(memory => ({
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
            people: memory.people.map(p => ({
                id: p.familyMember.id,
                name: `${p.familyMember.firstName} ${p.familyMember.lastName}`,
                photo: p.familyMember.profilePhoto
            })),
            albums: memory.albums.map(a => ({
                id: a.album.id,
                name: a.album.name
            })),
            commentCount: memory._count.comments
        })))
    } catch (error) {
        console.error('Error fetching memories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch memories' },
            { status: 500 }
        )
    }
}

// POST /api/memories - Create a new memory with file upload
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Parse form data
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const title = formData.get('title') as string
        const description = formData.get('description') as string | null
        const dateTaken = formData.get('dateTaken') as string | null
        const location = formData.get('location') as string | null
        const tagIdsJson = formData.get('tagIds') as string | null
        const albumIdsJson = formData.get('albumIds') as string | null

        // Validate required fields
        if (!title || title.trim().length === 0) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            )
        }

        if (!file) {
            return NextResponse.json(
                { error: 'File is required' },
                { status: 400 }
            )
        }

        // Validate file size (50MB max)
        const maxSize = 50 * 1024 * 1024 // 50MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size exceeds 50MB limit' },
                { status: 400 }
            )
        }

        // Validate file type
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/webm', 'video/quicktime'
        ]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, MP4, WebM' },
                { status: 400 }
            )
        }

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'memories')
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        // Generate unique filename and save file
        const filename = generateFilename(file.name)
        const filepath = path.join(uploadDir, filename)
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)

        // Create the file URL
        const fileUrl = `/uploads/memories/${filename}`

        // Determine memory type
        const memoryType = getMemoryType(file.type)

        // Parse tag and album IDs
        let tagIds: string[] = []
        let albumIds: string[] = []

        try {
            if (tagIdsJson) tagIds = JSON.parse(tagIdsJson)
            if (albumIdsJson) albumIds = JSON.parse(albumIdsJson)
        } catch (e) {
            console.error('Error parsing tag/album IDs:', e)
        }

        // Create the memory in database
        const memory = await prisma.memory.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                type: memoryType,
                fileUrl,
                thumbnailUrl: memoryType === 'PHOTO' ? fileUrl : null, // Use same URL for photos
                dateTaken: dateTaken ? new Date(dateTaken) : null,
                location: location?.trim() || null,
                uploadedById: session.user.id,
                // Create tag connections
                tags: tagIds.length > 0 ? {
                    create: tagIds.map(tagId => ({
                        tag: { connect: { id: tagId } }
                    }))
                } : undefined,
                // Create album connections
                albums: albumIds.length > 0 ? {
                    create: albumIds.map(albumId => ({
                        album: { connect: { id: albumId } }
                    }))
                } : undefined
            },
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
                }
            }
        })

        return NextResponse.json({
            id: memory.id,
            title: memory.title,
            description: memory.description,
            type: memory.type,
            fileUrl: memory.fileUrl,
            thumbnailUrl: memory.thumbnailUrl,
            dateTaken: memory.dateTaken?.toISOString() || null,
            location: memory.location,
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
            }))
        }, { status: 201 })

    } catch (error) {
        console.error('Error creating memory:', error)
        return NextResponse.json(
            { error: 'Failed to create memory' },
            { status: 500 }
        )
    }
}