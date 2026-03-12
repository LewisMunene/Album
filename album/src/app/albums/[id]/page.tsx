// src/app/albums/[id]/page.tsx
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import AlbumDetailClient from './AlbumDetailClient'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function AlbumDetailPage({ params }: PageProps) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/auth/login')
    }

    const { id } = await params

    // Fetch the album with all related data
    const [album, tags] = await Promise.all([
        prisma.album.findUnique({
            where: { id },
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
                                people: {
                                    include: {
                                        familyMember: {
                                            select: { id: true, firstName: true, lastName: true }
                                        }
                                    }
                                },
                                tags: {
                                    include: { tag: true }
                                }
                            }
                        }
                    },
                    orderBy: { order: 'asc' }
                }
            }
        }),
        prisma.tag.findMany({
            orderBy: { name: 'asc' }
        })
    ])

    if (!album) {
        notFound()
    }

    // Format the album data for the client component
    const formattedAlbum = {
        id: album.id,
        name: album.name,
        description: album.description,
        coverImageUrl: album.coverImageUrl,
        createdBy: album.createdBy,
        createdAt: album.createdAt.toISOString(),
        memories: album.memories.map(am => ({
            id: am.memory.id,
            title: am.memory.title,
            description: am.memory.description,
            type: am.memory.type as 'PHOTO' | 'VIDEO' | 'STORY',
            fileUrl: am.memory.fileUrl,
            thumbnailUrl: am.memory.thumbnailUrl,
            dateTaken: am.memory.dateTaken?.toISOString() || null,
            location: am.memory.location,
            uploadedBy: am.memory.uploadedBy,
            people: am.memory.people.map(p => ({
                id: p.familyMember.id,
                name: `${p.familyMember.firstName} ${p.familyMember.lastName}`
            })),
            tags: am.memory.tags.map(t => t.tag.name)
        }))
    }

    const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color
    }))

    return (
        <AlbumDetailClient
            album={formattedAlbum}
            user={{ id: session.user.id, name: session.user.name }}
            tags={formattedTags}
        />
    )
}