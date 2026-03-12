// src/app/albums/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import AlbumsPageClient from './AlbumsPageClient'

export default async function AlbumsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/auth/login')
    }

    // Fetch all albums with memory count and first memory as cover
    const albums = await prisma.album.findMany({
        include: {
            createdBy: {
                select: { id: true, name: true, avatar: true }
            },
            memories: {
                include: {
                    memory: {
                        select: {
                            id: true,
                            fileUrl: true,
                            thumbnailUrl: true,
                            title: true,
                            type: true
                        }
                    }
                },
                orderBy: { order: 'asc' },
                take: 4 // Get first 4 for preview
            },
            _count: {
                select: { memories: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    // Format albums for client
    const formattedAlbums = albums.map(album => ({
        id: album.id,
        name: album.name,
        description: album.description,
        coverImageUrl: album.coverImageUrl || album.memories[0]?.memory.fileUrl || null,
        memoryCount: album._count.memories,
        previewImages: album.memories.slice(0, 4).map(m => m.memory.fileUrl),
        createdBy: album.createdBy,
        createdAt: album.createdAt.toISOString(),
    }))

    // Get total stats
    const totalMemories = await prisma.memory.count()
    const totalAlbums = albums.length

    return (
        <AlbumsPageClient
            albums={formattedAlbums}
            user={session.user}
            stats={{ totalAlbums, totalMemories }}
        />
    )
}