// src/app/api/albums/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Fetch all albums
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const albums = await prisma.album.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                coverImageUrl: true,
                isPublic: true,
                createdAt: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
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

        return NextResponse.json({
            albums: albums.map(a => ({
                id: a.id,
                name: a.name,
                description: a.description,
                coverImageUrl: a.coverImageUrl,
                isPublic: a.isPublic,
                createdAt: a.createdAt,
                createdBy: a.createdBy.name,
                memoryCount: a._count.memories
            }))
        })

    } catch (error) {
        console.error('Error fetching albums:', error)
        return NextResponse.json(
            { error: 'Failed to fetch albums' },
            { status: 500 }
        )
    }
}

// POST - Create a new album
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, description, coverImageUrl, isPublic } = body

        if (!name) {
            return NextResponse.json(
                { error: 'Album name is required' },
                { status: 400 }
            )
        }

        const album = await prisma.album.create({
            data: {
                name,
                description,
                coverImageUrl,
                isPublic: isPublic ?? false,
                createdById: session.user.id,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        })

        return NextResponse.json({ album }, { status: 201 })

    } catch (error) {
        console.error('Error creating album:', error)
        return NextResponse.json(
            { error: 'Failed to create album' },
            { status: 500 }
        )
    }
}