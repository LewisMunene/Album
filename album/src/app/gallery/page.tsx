// src/app/gallery/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import GalleryPageClient from './GalleryPageClient'

export default async function GalleryPage() {
    const session = await getServerSession(authOptions)

    // Redirect to login if not authenticated
    if (!session?.user) {
        redirect('/auth/login')
    }

    // Fetch all memories with related data
    const [memories, tags, albums] = await Promise.all([
        prisma.memory.findMany({
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
                        album: { select: { id: true, name: true } }
                    }
                },
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.tag.findMany({
            orderBy: { name: 'asc' }
        }),
        prisma.album.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true }
        })
    ])

    // Format memories for client
    const formattedMemories = memories.map(memory => ({
        id: memory.id,
        title: memory.title,
        description: memory.description,
        type: memory.type as 'PHOTO' | 'VIDEO' | 'STORY',
        fileUrl: memory.fileUrl,
        thumbnailUrl: memory.thumbnailUrl,
        dateTaken: memory.dateTaken?.toISOString() || null,
        location: memory.location,
        viewCount: memory.viewCount,
        createdAt: memory.createdAt.toISOString(),
        uploadedBy: {
            id: memory.uploadedBy.id,
            name: memory.uploadedBy.name,
            avatar: memory.uploadedBy.avatar
        },
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
    }))

    return (
        <GalleryPageClient
            user={session.user}
            memories={formattedMemories}
            tags={tags}
            albums={albums}
        />
    )
}