// src/app/album/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import AlbumPageClient from './AlbumPageClient'

export default async function AlbumPage() {
    const session = await getServerSession(authOptions)

    // Redirect to login if not authenticated
    if (!session?.user) {
        redirect('/auth/login')
    }

    // Fetch data in parallel
    const [memories, memoriesCount, albumsCount, familyMembersCount, commentsCount] = await Promise.all([
        // Fetch recent memories
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
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 12,
        }),
        prisma.memory.count(),
        prisma.album.count(),
        prisma.familyMember.count(),
        prisma.comment.count(),
    ])

    // Format recent memories for client
    const recentMemories = memories.map((memory, index) => ({
        id: memory.id,
        title: memory.title,
        description: memory.description,
        type: memory.type as 'PHOTO' | 'VIDEO' | 'STORY',
        fileUrl: memory.fileUrl,
        thumbnailUrl: memory.thumbnailUrl,
        date: memory.dateTaken
            ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(memory.dateTaken)
            : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(memory.createdAt),
        location: memory.location,
        uploadedBy: memory.uploadedBy.name || 'Unknown',
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
        rotation: ((index % 5) - 2) * 2,
    }))

    // On This Day - find memories from this day in previous years
    const today = new Date()
    const onThisDayMemories = memories
        .filter(m => {
            if (!m.dateTaken) return false
            const memoryDate = new Date(m.dateTaken)
            return memoryDate.getMonth() === today.getMonth()
                && memoryDate.getDate() === today.getDate()
                && memoryDate.getFullYear() < today.getFullYear()
        })
        .map(m => ({
            id: m.id,
            title: m.title,
            year: m.dateTaken ? new Date(m.dateTaken).getFullYear().toString() : '',
            fileUrl: m.fileUrl,
            thumbnailUrl: m.thumbnailUrl,
            type: m.type,
            location: m.location,
            emoji: getEmoji(m.title, m.type),
        }))

    // Pass data to client component
    return (
        <AlbumPageClient
            user={session.user}
            onThisDayMemories={onThisDayMemories}
            recentMemories={recentMemories}
            stats={{
                memories: memoriesCount,
                albums: albumsCount,
                familyMembers: familyMembersCount,
                comments: commentsCount,
            }}
        />
    )
}

// Helper function to generate emoji based on title
function getEmoji(title: string, type: string): string {
    const titleLower = title.toLowerCase()

    if (titleLower.includes('birthday')) return '🎂'
    if (titleLower.includes('christmas')) return '🎄'
    if (titleLower.includes('wedding')) return '💒'
    if (titleLower.includes('graduation')) return '🎓'
    if (titleLower.includes('beach') || titleLower.includes('ocean')) return '🏖️'
    if (titleLower.includes('vacation') || titleLower.includes('trip')) return '✈️'
    if (titleLower.includes('family')) return '👨‍👩‍👧‍👦'
    if (titleLower.includes('party')) return '🎉'
    if (titleLower.includes('school')) return '📚'
    if (type === 'VIDEO') return '🎬'
    if (type === 'STORY') return '📖'

    return '📷'
}