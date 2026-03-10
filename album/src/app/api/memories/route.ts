// src/app/api/memories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// GET - List memories with optional filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = parseInt(searchParams.get('offset') || '0')

        const where: Record<string, unknown> = {}
        if (type && ['PHOTO', 'VIDEO', 'STORY'].includes(type)) {
            where.type = type
        }

        const [memories, total] = await Promise.all([
            prisma.memory.findMany({
                where,
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
                    _count: {
                        select: { comments: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.memory.count({ where })
        ])

        return NextResponse.json({
            memories,
            total,
            hasMore: offset + memories.length < total
        })

    } catch (error) {
        console.error('Get memories error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch memories' },
            { status: 500 }
        )
    }
}

// POST - Create a new memory with file upload
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()

        // Extract form fields
        const title = formData.get('title') as string
        const type = formData.get('type') as 'PHOTO' | 'VIDEO' | 'STORY'
        const description = formData.get('description') as string | null
        const location = formData.get('location') as string | null
        const dateTaken = formData.get('dateTaken') as string | null
        const albumId = formData.get('albumId') as string | null
        const file = formData.get('file') as File | null

        // Parse JSON arrays
        let peopleIds: string[] = []
        let tagIds: string[] = []

        try {
            const peopleIdsStr = formData.get('peopleIds') as string
            if (peopleIdsStr) peopleIds = JSON.parse(peopleIdsStr)
        } catch { }

        try {
            const tagIdsStr = formData.get('tagIds') as string
            if (tagIdsStr) tagIds = JSON.parse(tagIdsStr)
        } catch { }

        // Validate required fields
        if (!title || !title.trim()) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            )
        }

        if (!type || !['PHOTO', 'VIDEO', 'STORY'].includes(type)) {
            return NextResponse.json(
                { error: 'Valid type is required (PHOTO, VIDEO, STORY)' },
                { status: 400 }
            )
        }

        // For PHOTO and VIDEO, file is required
        if (type !== 'STORY' && !file) {
            return NextResponse.json(
                { error: 'File is required for photos and videos' },
                { status: 400 }
            )
        }

        let fileUrl = ''
        let thumbnailUrl: string | null = null

        // Handle file upload
        if (file) {
            // Validate file type
            const validTypes = [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'video/mp4', 'video/webm', 'video/quicktime'
            ]

            if (!validTypes.includes(file.type)) {
                return NextResponse.json(
                    { error: 'Invalid file type. Supported: JPEG, PNG, GIF, WebP, MP4, WebM' },
                    { status: 400 }
                )
            }

            // Validate file size (50MB max)
            if (file.size > 50 * 1024 * 1024) {
                return NextResponse.json(
                    { error: 'File size must be less than 50MB' },
                    { status: 400 }
                )
            }

            // Create upload directory if it doesn't exist
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'memories')
            await mkdir(uploadDir, { recursive: true })

            // Generate unique filename
            const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`
            const filename = `${uuidv4()}${ext}`
            const filepath = path.join(uploadDir, filename)

            // Write file to disk
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            await writeFile(filepath, buffer)

            // Set the URL (relative to public folder)
            fileUrl = `/uploads/memories/${filename}`

            // For images, use the same file as thumbnail for now
            // In production, you'd generate actual thumbnails
            if (file.type.startsWith('image/')) {
                thumbnailUrl = fileUrl
            }
        }

        // For STORY type without file, create a placeholder
        if (type === 'STORY' && !file) {
            fileUrl = '/images/story-placeholder.svg'
        }

        // Create memory with relations in a transaction
        const memory = await prisma.$transaction(async (tx) => {
            // Create the memory
            const newMemory = await tx.memory.create({
                data: {
                    title: title.trim(),
                    description: description?.trim() || null,
                    type,
                    fileUrl,
                    thumbnailUrl,
                    location: location?.trim() || null,
                    dateTaken: dateTaken ? new Date(dateTaken) : null,
                    uploadedById: session.user.id,
                }
            })

            // Link to family members
            if (peopleIds.length > 0) {
                await tx.memoryPerson.createMany({
                    data: peopleIds.map(familyMemberId => ({
                        memoryId: newMemory.id,
                        familyMemberId
                    }))
                })
            }

            // Link to tags
            if (tagIds.length > 0) {
                await tx.memoryTag.createMany({
                    data: tagIds.map(tagId => ({
                        memoryId: newMemory.id,
                        tagId
                    }))
                })
            }

            // Link to album
            if (albumId) {
                await tx.albumMemory.create({
                    data: {
                        albumId,
                        memoryId: newMemory.id,
                        order: 0
                    }
                })
            }

            return newMemory
        })

        // Fetch the complete memory with relations
        const completeMemory = await prisma.memory.findUnique({
            where: { id: memory.id },
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
                }
            }
        })

        return NextResponse.json({
            success: true,
            memory: completeMemory
        }, { status: 201 })

    } catch (error) {
        console.error('Create memory error:', error)
        return NextResponse.json(
            { error: 'Failed to create memory' },
            { status: 500 }
        )
    }
}