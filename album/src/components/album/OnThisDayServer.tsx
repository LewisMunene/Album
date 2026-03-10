// src/components/album/OnThisDayServer.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import OnThisDayClient from './OnThisDayClient'

export default async function OnThisDayServer() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return null
    }

    const today = new Date()
    const currentMonth = today.getMonth() + 1 // JS months are 0-indexed
    const currentDay = today.getDate()

    // Find memories from the same day in previous years
    // Using raw SQL for date part extraction (MySQL compatible)
    const memories = await prisma.$queryRaw<Array<{
        id: string
        title: string
        fileUrl: string
        thumbnailUrl: string | null
        type: string
        dateTaken: Date
        location: string | null
    }>>`
        SELECT id, title, fileUrl, thumbnailUrl, type, dateTaken, location
        FROM memories
        WHERE MONTH(dateTaken) = ${currentMonth}
          AND DAY(dateTaken) = ${currentDay}
          AND YEAR(dateTaken) < YEAR(CURDATE())
        ORDER BY dateTaken DESC
        LIMIT 10
    `

    // If no memories on this exact day, get memories from this week in previous years
    let displayMemories = memories

    if (memories.length === 0) {
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - 3)
        const endOfWeek = new Date(today)
        endOfWeek.setDate(today.getDate() + 3)

        displayMemories = await prisma.$queryRaw<Array<{
            id: string
            title: string
            fileUrl: string
            thumbnailUrl: string | null
            type: string
            dateTaken: Date
            location: string | null
        }>>`
            SELECT id, title, fileUrl, thumbnailUrl, type, dateTaken, location
            FROM memories
            WHERE MONTH(dateTaken) = ${currentMonth}
              AND DAY(dateTaken) BETWEEN ${startOfWeek.getDate()} AND ${endOfWeek.getDate()}
              AND YEAR(dateTaken) < YEAR(CURDATE())
            ORDER BY dateTaken DESC
            LIMIT 10
        `
    }

    // Transform data for client component
    const formattedMemories = displayMemories.map(memory => ({
        id: memory.id,
        title: memory.title,
        year: memory.dateTaken.getFullYear().toString(),
        fileUrl: memory.fileUrl,
        thumbnailUrl: memory.thumbnailUrl,
        type: memory.type,
        location: memory.location,
    }))

    // Generate placeholder emojis based on memory titles
    const getEmoji = (title: string, type: string) => {
        const titleLower = title.toLowerCase()

        // Common themes
        if (titleLower.includes('birthday')) return '🎂'
        if (titleLower.includes('christmas')) return '🎄'
        if (titleLower.includes('wedding')) return '💒'
        if (titleLower.includes('graduation')) return '🎓'
        if (titleLower.includes('beach') || titleLower.includes('ocean')) return '🏖️'
        if (titleLower.includes('vacation') || titleLower.includes('trip')) return '✈️'
        if (titleLower.includes('family')) return '👨‍👩‍👧‍👦'
        if (titleLower.includes('party')) return '🎉'
        if (titleLower.includes('school')) return '📚'
        if (titleLower.includes('garden') || titleLower.includes('flower')) return '🌸'
        if (titleLower.includes('food') || titleLower.includes('dinner') || titleLower.includes('lunch')) return '🍽️'
        if (titleLower.includes('pet') || titleLower.includes('dog')) return '🐕'
        if (titleLower.includes('cat')) return '🐈'
        if (titleLower.includes('baby')) return '👶'
        if (titleLower.includes('sunset') || titleLower.includes('sunrise')) return '🌅'

        // Type-based fallbacks
        if (type === 'VIDEO') return '🎬'
        if (type === 'STORY') return '📖'

        // Default photo emojis
        const photoEmojis = ['📷', '🖼️', '🌟', '💫', '🎨', '🏠']
        return photoEmojis[Math.floor(Math.random() * photoEmojis.length)]
    }

    const memoriesWithEmojis = formattedMemories.map(m => ({
        ...m,
        emoji: getEmoji(m.title, m.type)
    }))

    return <OnThisDayClient memories={memoriesWithEmojis} />
}