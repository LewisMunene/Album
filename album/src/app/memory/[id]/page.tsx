// src/app/memory/[id]/page.tsx
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import MemoryDetailClient from './MemoryDetailClient'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function MemoryDetailPage({ params }: PageProps) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/auth/login')
    }

    const { id } = await params

    // Fetch the memory with all related data
    const [memory, tags] = await Promise.all([
        prisma.memory.findUnique({
            where: { id },
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
                comments: {
                    include: {
                        author: {
                            select: { id: true, name: true, avatar: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        }),
        prisma.tag.findMany({
            orderBy: { name: 'asc' }
        })
    ])

    if (!memory) {
        notFound()
    }

    // Increment view count
    await prisma.memory.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
    })

    // Format the memory data for the client component
    const formattedMemory = {
        id: memory.id,
        title: memory.title,
        description: memory.description,
        type: memory.type as 'PHOTO' | 'VIDEO' | 'STORY',
        fileUrl: memory.fileUrl,
        thumbnailUrl: memory.thumbnailUrl,
        dateTaken: memory.dateTaken?.toISOString() || null,
        location: memory.location,
        viewCount: memory.viewCount + 1, // Include the increment
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
        comments: memory.comments.map(c => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt.toISOString(),
            author: c.author
        }))
    }

    const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color
    }))

    return (
        <MemoryDetailClient 
            memory={formattedMemory}
            user={{ id: session.user.id, name: session.user.name }}
            allTags={formattedTags}
        />
    )
}
