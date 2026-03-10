// src/app/memory/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import MemoryDetailClient from './MemoryDetailClient'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function MemoryDetailPage({ params }: PageProps) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        notFound()
    }

    const memory = await prisma.memory.findUnique({
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
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profilePhoto: true,
                            nickname: true
                        }
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
            },
            albums: {
                include: {
                    album: {
                        select: { id: true, name: true }
                    }
                }
            }
        }
    })

    if (!memory) {
        notFound()
    }

    // Format the data for the client component
    const formattedMemory = {
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
        people: memory.people.map(p => ({
            id: p.familyMember.id,
            firstName: p.familyMember.firstName,
            lastName: p.familyMember.lastName,
            nickname: p.familyMember.nickname,
            profilePhoto: p.familyMember.profilePhoto,
        })),
        tags: memory.tags.map(t => ({
            id: t.tag.id,
            name: t.tag.name,
            color: t.tag.color,
        })),
        albums: memory.albums.map(a => ({
            id: a.album.id,
            name: a.album.name,
        })),
        comments: memory.comments.map(c => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt.toISOString(),
            author: c.author,
        })),
    }

    // Increment view count
    await prisma.memory.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
    })

    return <MemoryDetailClient memory={formattedMemory} currentUser={session.user} />
}