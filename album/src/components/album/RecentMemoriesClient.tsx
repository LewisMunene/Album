'use client'

import { useState } from 'react'
import { Clock, MapPin } from 'lucide-react'
import Image from 'next/image'

interface Memory {
    id: string
    title: string
    description: string | null
    type: 'PHOTO' | 'VIDEO' | 'STORY'
    fileUrl: string
    thumbnailUrl: string | null
    date: string
    location: string | null
    uploadedBy: string
    commentCount: number
    people: Array<{
        id: string
        name: string
        photo: string | null
    }>
    tags: Array<{
        id: string
        name: string
        color: string | null
    }>
    rotation: number
}

interface RecentMemoriesClientProps {
    memories: Memory[]
}

export default function RecentMemoriesClient({ memories }: RecentMemoriesClientProps) {
    const [filter, setFilter] = useState<'all' | 'PHOTO' | 'VIDEO' | 'STORY'>('all')
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

    const filteredMemories = filter === 'all'
        ? memories
        : memories.filter(m => m.type === filter)

    const handleImageError = (id: string) => {
        setImageErrors(prev => new Set([...prev, id]))
    }

    // Placeholder emojis for different types
    const getPlaceholderEmoji = (type: string, index: number) => {
        const emojis = {
            PHOTO: ['📷', '🖼️', '📸', '🌅', '🏞️', '🎨'],
            VIDEO: ['🎬', '📹', '🎥', '🎞️', '📺', '🎦'],
            STORY: ['📖', '📝', '✍️', '📚', '💭', '🗒️'],
        }
        const list = emojis[type as keyof typeof emojis] || emojis.PHOTO
        return list[index % list.length]
    }

    if (memories.length === 0) {
        return (
            <section className="py-16 px-8 lg:px-12 xl:px-16">
                <div className="w-full">
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📷</div>
                        <h2 className="font-display text-2xl font-semibold mb-2">No memories yet</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Be the first to add a memory to the family album!
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 px-8 lg:px-12 xl:px-16">
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                    <div>
                        <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-2">
                            Recent Memories
                        </h2>
                        <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
                            Your latest captured moments
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        {[
                            { value: 'all', label: 'All' },
                            { value: 'PHOTO', label: 'Photos' },
                            { value: 'VIDEO', label: 'Videos' },
                            { value: 'STORY', label: 'Stories' },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setFilter(value as typeof filter)}
                                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                                style={filter === value ? {
                                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                                    color: 'white',
                                } : {
                                    backgroundColor: 'var(--color-card)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-muted)'
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Polaroid Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {filteredMemories.map((memory, index) => (
                        <div key={memory.id} className="flex justify-center">
                            <div
                                className="polaroid cursor-pointer w-full max-w-[300px] group"
                                style={{ transform: `rotate(${memory.rotation}deg)` }}
                            >
                                {/* Photo Container */}
                                <div
                                    className="aspect-[4/3] rounded-sm flex items-center justify-center overflow-hidden relative"
                                    style={{ backgroundColor: 'var(--color-bg-alt)' }}
                                >
                                    {imageErrors.has(memory.id) || !memory.fileUrl ? (
                                        <span className="text-5xl">
                                            {getPlaceholderEmoji(memory.type, index)}
                                        </span>
                                    ) : (
                                        <Image
                                            src={memory.fileUrl}
                                            alt={memory.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={() => handleImageError(memory.id)}
                                        />
                                    )}
                                </div>

                                {/* Caption */}
                                <div className="mt-4 text-center">
                                    <p className="font-medium text-base mb-2">{memory.title}</p>
                                    <div
                                        className="flex items-center justify-center gap-4 text-xs"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {memory.date}
                                        </span>
                                        {memory.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {memory.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {filteredMemories.length >= 12 && (
                    <div className="text-center mt-20 relative z-10">
                        <button
                            className="px-8 py-3 rounded-lg text-base font-medium transition-all hover:-translate-y-0.5"
                            style={{
                                backgroundColor: 'var(--color-card)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-muted)'
                            }}
                        >
                            Load More Memories
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}