// src/app/api/albums/list/route.ts
// Simple endpoint to get album list for dropdowns/selects
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

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
            select: {
                id: true,
                name: true,
                description: true,
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

        return NextResponse.json(albums.map(album => ({
            id: album.id,
            name: album.name,
            description: album.description,
            memoryCount: album._count.memories
        })))
    } catch (error) {
        console.error('Error fetching albums list:', error)
        return NextResponse.json(
            { error: 'Failed to fetch albums' },
            { status: 500 }
        )
    }
}