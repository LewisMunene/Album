'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Sparkles,
    Search,
    ArrowRight,
    Calendar,
    MapPin,
    MessageCircle,
    ChevronRight,
    Play,
    FileText,
    Image as ImageIcon
} from 'lucide-react'
import DashboardNavbar from '@/components/shared/DashboardNavbar'
import Stats from '@/components/dashboard/Stats'
import DashboardFooter from '@/components/dashboard/DashboardFooter'
import CreateMemoryForm from '@/components/album/CreateMemoryForm'
import styles from './AlbumPage.module.css'

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
    people: Array<{ id: string; name: string; photo: string | null }>
    tags: Array<{ id: string; name: string; color: string | null }>
    rotation: number
}

interface OnThisDayMemory {
    id: string
    title: string
    year: string
    fileUrl: string
    thumbnailUrl: string | null
    type: string
    location: string | null
    emoji: string
}

interface AlbumPageClientProps {
    user: {
        id?: string
        name?: string | null
        email?: string | null
    }
    onThisDayMemories: OnThisDayMemory[]
    recentMemories: Memory[]
    stats: {
        memories: number
        albums: number
        familyMembers: number
        comments: number
    }
}

export default function AlbumPageClient({
    user,
    onThisDayMemories,
    recentMemories,
    stats
}: AlbumPageClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

    const handleImageError = (id: string) => {
        setImageErrors(prev => new Set([...prev, id]))
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Play className={styles.typeIcon} />
            case 'STORY': return <FileText className={styles.typeIcon} />
            default: return null
        }
    }

    const handleAddMemorySuccess = () => {
        window.location.reload()
    }

    return (
        <div className={styles.page}>
            {/* Navbar */}
            <DashboardNavbar
                user={user}
                onAddMemory={() => setShowAddModal(true)}
            />

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroGrid}>
                        {/* Left Content */}
                        <div className={styles.heroContent}>
                            {/* Welcome Badge */}
                            <div className={styles.welcomeBadge}>
                                <Sparkles />
                                <span>Welcome back, {user.name?.split(' ')[0] || 'there'}</span>
                            </div>

                            {/* Headline */}
                            <h1 className={styles.heroTitle}>
                                Every moment
                                <br />
                                <span className={styles.heroTitleAccent}>tells a story</span>
                            </h1>

                            {/* Description */}
                            <p className={styles.heroDescription}>
                                Your family's memories, beautifully preserved. Browse through
                                generations of love, laughter, and legacy.
                            </p>

                            {/* Search Bar */}
                            <div className={styles.searchBar}>
                                <div className={styles.searchInputWrapper}>
                                    <Search />
                                    <input
                                        type="text"
                                        placeholder="Search memories..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button className={styles.searchButton}>
                                    Search
                                </button>
                            </div>

                            {/* Quick Links */}
                            <div className={styles.quickLinks}>
                                <Link href="/gallery" className={styles.primaryLink}>
                                    Browse Gallery
                                    <ArrowRight />
                                </Link>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className={styles.secondaryLink}
                                >
                                    Upload Photos
                                </button>
                            </div>
                        </div>

                        {/* Right - Polaroid Photos */}
                        <div className={styles.heroPolaroids}>
                            <div className={styles.polaroidDecor} />

                            {recentMemories.slice(0, 3).map((memory, index) => (
                                <Link
                                    key={memory.id}
                                    href={`/memory/${memory.id}`}
                                    className={`${styles.polaroid} ${styles[`polaroid${index + 1}`]}`}
                                >
                                    <div className={styles.polaroidImage}>
                                        {memory.fileUrl && !imageErrors.has(memory.id) ? (
                                            <Image
                                                src={memory.thumbnailUrl || memory.fileUrl}
                                                alt={memory.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                onError={() => handleImageError(memory.id)}
                                            />
                                        ) : (
                                            <div className={styles.polaroidPlaceholder}>
                                                <ImageIcon />
                                            </div>
                                        )}
                                        {memory.type === 'VIDEO' && (
                                            <div className={styles.videoOverlay}>
                                                <Play />
                                            </div>
                                        )}
                                    </div>
                                    <p className={styles.polaroidCaption}>{memory.title}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* On This Day Section */}
            {onThisDayMemories.length > 0 && (
                <section className={styles.onThisDay}>
                    <div className={styles.sectionContainer}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <Calendar />
                                On This Day
                            </h2>
                            <p className={styles.sectionSubtitle}>Memories from years past</p>
                        </div>

                        <div className={styles.onThisDayGrid}>
                            {onThisDayMemories.map(memory => (
                                <Link
                                    key={memory.id}
                                    href={`/memory/${memory.id}`}
                                    className={styles.onThisDayCard}
                                >
                                    <div className={styles.onThisDayImage}>
                                        {memory.fileUrl && !imageErrors.has(memory.id) ? (
                                            <Image
                                                src={memory.thumbnailUrl || memory.fileUrl}
                                                alt={memory.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                onError={() => handleImageError(memory.id)}
                                            />
                                        ) : (
                                            <div className={styles.onThisDayPlaceholder}>
                                                <ImageIcon />
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.onThisDayContent}>
                                        <span className={styles.onThisDayYear}>{memory.year}</span>
                                        <p className={styles.onThisDayTitle}>{memory.title}</p>
                                        {memory.location && (
                                            <span className={styles.onThisDayLocation}>
                                                <MapPin /> {memory.location}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <div className={styles.sectionContainer}>
                    <Stats data={stats} />
                </div>
            </section>

            {/* Recent Memories */}
            <section className={styles.recentMemories}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Recent Memories</h2>
                            <p className={styles.sectionSubtitle}>Latest additions to your collection</p>
                        </div>
                        <Link href="/gallery" className={styles.viewAllLink}>
                            View All <ChevronRight />
                        </Link>
                    </div>

                    <div className={styles.memoriesGrid}>
                        {recentMemories.map(memory => (
                            <Link
                                key={memory.id}
                                href={`/memory/${memory.id}`}
                                className={styles.memoryCard}
                            >
                                <div className={styles.memoryImage}>
                                    {memory.fileUrl && !imageErrors.has(memory.id) ? (
                                        <>
                                            <Image
                                                src={memory.thumbnailUrl || memory.fileUrl}
                                                alt={memory.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                onError={() => handleImageError(memory.id)}
                                            />
                                            {getTypeIcon(memory.type)}
                                        </>
                                    ) : (
                                        <div className={styles.memoryPlaceholder}>
                                            <ImageIcon />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.memoryContent}>
                                    <h3 className={styles.memoryTitle}>{memory.title}</h3>
                                    <div className={styles.memoryMeta}>
                                        <span><Calendar /> {memory.date}</span>
                                        {memory.location && (
                                            <span><MapPin /> {memory.location}</span>
                                        )}
                                    </div>
                                    {memory.people.length > 0 && (
                                        <p className={styles.memoryPeople}>
                                            {memory.people.map(p => p.name).join(', ')}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <DashboardFooter />

            {/* Use the shared CreateMemoryForm component */}
            <CreateMemoryForm
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleAddMemorySuccess}
            />
        </div>
    )
}