// src/components/album/RecentMemoriesServer.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import RecentMemoriesClient from './RecentMemoriesClient'

export default async function RecentMemoriesServer() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    // Fetch recent memories from database
    const memories = await prisma.memory.findMany({
        include: {
            uploadedBy: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                }
            },
            tags: {
                include: {
                    tag: true
                }
            },
            people: {
                include: {
                    familyMember: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profilePhoto: true,
                        }
                    }
                }
            },
            _count: {
                select: {
                    comments: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 12,
    })

    // Transform data for client component
    const formattedMemories = memories.map((memory, index) => ({
        id: memory.id,
        title: memory.title,
        description: memory.description,
        type: memory.type,
        fileUrl: memory.fileUrl,
        thumbnailUrl: memory.thumbnailUrl,
        date: memory.dateTaken
            ? new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(memory.dateTaken)
            : new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(memory.createdAt),
        location: memory.location,
        uploadedBy: memory.uploadedBy.name,
        commentCount: memory._count.comments,
        people: memory.people.map(p => ({
            id: p.familyMember.id,
            name: `${p.familyMember.firstName} ${p.familyMember.lastName}`,
            photo: p.familyMember.profilePhoto,
        })),
        tags: memory.tags.map(t => ({
            id: t.tag.id,
            name: t.tag.name,
            color: t.tag.color,
        })),
        // Rotation for polaroid effect
        rotation: ((index % 5) - 2) * 2,
    }))

    return <RecentMemoriesClient memories={formattedMemories} />
}