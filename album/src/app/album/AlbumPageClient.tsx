'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Sun, Moon, Menu, Plus, Sparkles, Search, ArrowRight, Bell, ChevronRight, Clock, MapPin, Play } from 'lucide-react'
import styles from './AlbumPage.module.css'
import CreateMemoryForm from '@/components/album/CreateMemoryForm'

interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
}

interface AlbumPageClientProps {
    user: User
    onThisDayMemories: Array<{
        id: string
        title: string
        year: string
        fileUrl: string
        thumbnailUrl: string | null
        type: string
        location: string | null
        emoji: string
    }>
    recentMemories: Array<{
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
    }>
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
    const [isDark, setIsDark] = useState(false)
    const [filter, setFilter] = useState<'all' | 'PHOTO' | 'VIDEO' | 'STORY'>('all')
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

    const filteredMemories = filter === 'all'
        ? recentMemories
        : recentMemories.filter(m => m.type === filter)

    const getPlaceholderEmoji = (type: string, index: number) => {
        const emojis = {
            PHOTO: ['📷', '🖼️', '📸', '🌅', '🏞️', '🎨'],
            VIDEO: ['🎬', '📹', '🎥', '🎞️', '📺', '🎦'],
            STORY: ['📖', '📝', '✍️', '📚', '💭', '🗒️'],
        }
        const list = emojis[type as keyof typeof emojis] || emojis.PHOTO
        return list[index % list.length]
    }

    const handleImageError = (memoryId: string) => {
        setImageErrors(prev => new Set([...prev, memoryId]))
    }

    const handleMemoryCreated = () => {
        window.location.reload()
    }

    const rotations = [-4, 3, -2, 4, -3, 2]

    // Check if a memory has a valid image URL
    const hasValidImage = (memory: { id: string; fileUrl: string; type: string }) => {
        if (imageErrors.has(memory.id)) return false
        if (!memory.fileUrl) return false
        if (memory.type === 'STORY') return false
        // Check if it's a real uploaded file (not a placeholder)
        if (memory.fileUrl.includes('placeholder') || memory.fileUrl.includes('.svg')) return false
        return true
    }

    return (
        <div className={`${styles.page} ${isDark ? 'dark' : ''}`}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={styles.navInner}>
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Heart />
                        </div>
                        <span className={styles.logoText}>
                            Muthee<span className={styles.logoTextMuted}>Family</span>
                        </span>
                    </Link>

                    <div className={styles.navLinks}>
                        {['Memories', 'Albums', 'Timeline', 'Family'].map((item, i) => (
                            <Link
                                key={item}
                                href="#"
                                className={`${styles.navLink} ${i === 0 ? styles.navLinkActive : ''}`}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className={styles.navActions}>
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={styles.themeToggle}
                        >
                            {isDark ? <Sun /> : <Moon />}
                        </button>
                        <button
                            onClick={() => setIsCreateFormOpen(true)}
                            className={styles.addButton}
                        >
                            <Plus />
                            <span>Add Memory</span>
                        </button>
                        <button className={styles.mobileMenuBtn}>
                            <Menu />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroGrid}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroLabel}>
                            <Sparkles />
                            Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}
                        </div>
                        <h1 className={styles.heroTitle}>
                            Every moment<br />
                            <span className={styles.heroTitleAccent}>tells a story</span>
                        </h1>
                        <p className={styles.heroDescription}>
                            Your family&apos;s memories, beautifully preserved. Browse through
                            generations of love, laughter, and legacy.
                        </p>

                        <div className={styles.searchBar}>
                            <div className={styles.searchInputWrapper}>
                                <Search />
                                <input type="text" placeholder="Search memories..." />
                            </div>
                            <button className={styles.searchButton}>Search</button>
                        </div>

                        <div className={styles.heroLinks}>
                            <Link href="/gallery" className={`${styles.heroLink} ${styles.heroLinkPrimary}`}>
                                Browse Gallery <ArrowRight />
                            </Link>
                            <button
                                onClick={() => setIsCreateFormOpen(true)}
                                className={`${styles.heroLink} ${styles.heroLinkSecondary}`}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Upload Photos
                            </button>
                        </div>
                    </div>

                    <div className={styles.heroPolaroids}>
                        {/* Show recent memories in hero polaroids if available */}
                        {recentMemories.slice(0, 3).map((memory, i) => (
                            <Link
                                key={memory.id}
                                href={`/memory/${memory.id}`}
                                className={`${styles.polaroid} ${i === 0 ? styles.polaroid1 : i === 1 ? styles.polaroid2 : styles.polaroid3}`}
                            >
                                <div
                                    className={styles.polaroidImage}
                                    style={{
                                        background: hasValidImage(memory) ? undefined : 'linear-gradient(135deg, #d4e7d4, #b8d4b8)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {hasValidImage(memory) ? (
                                        <Image
                                            src={memory.fileUrl}
                                            alt={memory.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            onError={() => handleImageError(memory.id)}
                                        />
                                    ) : (
                                        <span>{getPlaceholderEmoji(memory.type, i)}</span>
                                    )}
                                </div>
                                <p className={styles.polaroidCaption}>{memory.title}</p>
                            </Link>
                        ))}
                        {/* Show placeholder polaroids if less than 3 memories */}
                        {recentMemories.length < 3 && (
                            <>
                                {recentMemories.length < 1 && (
                                    <div className={`${styles.polaroid} ${styles.polaroid1}`}>
                                        <div className={styles.polaroidImage} style={{ background: 'linear-gradient(135deg, #d4e7d4, #b8d4b8)' }}>
                                            <span>📸</span>
                                        </div>
                                        <p className={styles.polaroidCaption}>Summer 2024</p>
                                    </div>
                                )}
                                {recentMemories.length < 2 && (
                                    <div className={`${styles.polaroid} ${styles.polaroid2}`}>
                                        <div className={styles.polaroidImage} style={{ background: 'linear-gradient(135deg, #f5e6dc, #e8d4c4)' }}>
                                            <span>🎉</span>
                                        </div>
                                        <p className={styles.polaroidCaption}>Celebrations</p>
                                    </div>
                                )}
                                {recentMemories.length < 3 && (
                                    <div className={`${styles.polaroid} ${styles.polaroid3}`}>
                                        <div className={styles.polaroidImage} style={{ background: 'linear-gradient(135deg, #dce8f0, #c8d8e8)' }}>
                                            <span>❤️</span>
                                        </div>
                                        <p className={styles.polaroidCaption}>Together</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* On This Day Section */}
            <section className={styles.onThisDay}>
                <div className={styles.onThisDayInner}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                            <div className={styles.sectionIcon}>
                                <Bell />
                            </div>
                            <div className={styles.sectionTitleText}>
                                <h2>On This Day</h2>
                                <p>Memories from years past</p>
                            </div>
                        </div>
                        <Link href="#" className={styles.sectionLink}>
                            View all <ChevronRight />
                        </Link>
                    </div>

                    <div className={styles.memoryCards}>
                        {onThisDayMemories.length === 0 ? (
                            <div className={styles.memoryCard}>
                                <div className={styles.memoryEmoji}>📅</div>
                                <p className={styles.memoryTitle}>No memories on this day yet</p>
                            </div>
                        ) : (
                            onThisDayMemories.map((memory) => {
                                const hasImage = !imageErrors.has(memory.id) &&
                                    memory.fileUrl &&
                                    !memory.fileUrl.includes('placeholder') &&
                                    !memory.fileUrl.includes('.svg') &&
                                    memory.type !== 'STORY'

                                return (
                                    <Link
                                        key={memory.id}
                                        href={`/memory/${memory.id}`}
                                        className={styles.memoryCard}
                                    >
                                        {hasImage ? (
                                            <div className={styles.memoryImageWrapper}>
                                                <Image
                                                    src={memory.thumbnailUrl || memory.fileUrl}
                                                    alt={memory.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    onError={() => handleImageError(memory.id)}
                                                />
                                            </div>
                                        ) : (
                                            <div className={styles.memoryEmoji}>{memory.emoji}</div>
                                        )}
                                        <p className={styles.memoryYear}>{memory.year}</p>
                                        <p className={styles.memoryTitle}>{memory.title}</p>
                                    </Link>
                                )
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* Recent Memories Section */}
            <section className={styles.recentMemories}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitleText}>
                        <h2>Recent Memories</h2>
                        <p>Your latest captured moments</p>
                    </div>
                    <div className={styles.filterTabs}>
                        {[
                            { value: 'all', label: 'All' },
                            { value: 'PHOTO', label: 'Photos' },
                            { value: 'VIDEO', label: 'Videos' },
                            { value: 'STORY', label: 'Stories' },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setFilter(value as typeof filter)}
                                className={`${styles.filterTab} ${filter === value ? styles.filterTabActive : styles.filterTabInactive}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredMemories.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📷</div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '8px' }}>
                            No memories yet
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                            Be the first to add a memory to the family album!
                        </p>
                        <button
                            onClick={() => setIsCreateFormOpen(true)}
                            className={styles.addButton}
                        >
                            <Plus />
                            <span>Add Your First Memory</span>
                        </button>
                    </div>
                ) : (
                    <div className={styles.polaroidGrid}>
                        {filteredMemories.map((memory, index) => (
                            <div key={memory.id} className={styles.polaroidItem}>
                                <Link
                                    href={`/memory/${memory.id}`}
                                    className={styles.polaroidCard}
                                    style={{ transform: `rotate(${rotations[index % 6]}deg)` }}
                                >
                                    <div
                                        className={styles.polaroidCardImage}
                                        style={{ position: 'relative', overflow: 'hidden' }}
                                    >
                                        {hasValidImage(memory) ? (
                                            <>
                                                <Image
                                                    src={memory.thumbnailUrl || memory.fileUrl}
                                                    alt={memory.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    onError={() => handleImageError(memory.id)}
                                                />
                                                {memory.type === 'VIDEO' && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: 'rgba(0,0,0,0.3)'
                                                    }}>
                                                        <div style={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: '50%',
                                                            background: 'rgba(255,255,255,0.9)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Play style={{ width: 24, height: 24, color: '#3D3229', marginLeft: 3 }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <span>{getPlaceholderEmoji(memory.type, index)}</span>
                                        )}
                                    </div>
                                    <div className={styles.polaroidCardCaption}>
                                        <h4>{memory.title}</h4>
                                        <div className={styles.polaroidCardMeta}>
                                            <span><Clock /> {memory.date}</span>
                                            {memory.location && (
                                                <span><MapPin /> {memory.location}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {filteredMemories.length > 0 && (
                    <div className={styles.loadMore}>
                        <button className={styles.loadMoreBtn}>Load More Memories</button>
                    </div>
                )}
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className={styles.statsInner}>
                    {[
                        { emoji: '📷', value: stats.memories, label: 'Memories' },
                        { emoji: '📁', value: stats.albums, label: 'Albums' },
                        { emoji: '👨‍👩‍👧‍👦', value: stats.familyMembers, label: 'Family Members' },
                        { emoji: '💬', value: stats.comments, label: 'Comments' },
                    ].map((stat, i) => (
                        <div key={i} className={styles.statCard}>
                            <div className={styles.statEmoji}>{stat.emoji}</div>
                            <div className={styles.statNumber}>{stat.value.toLocaleString()}</div>
                            <div className={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <div className={styles.footerLinks}>
                        <Link href="#" className={styles.footerLink}>Privacy</Link>
                        <Link href="#" className={styles.footerLink}>Terms</Link>
                        <Link href="#" className={styles.footerLink}>Help</Link>
                    </div>
                    <p className={styles.footerCopyright}>
                        © 2024 Muthee Family. Made with ❤️
                    </p>
                </div>
            </footer>

            {/* Create Memory Form Modal */}
            <CreateMemoryForm
                isOpen={isCreateFormOpen}
                onClose={() => setIsCreateFormOpen(false)}
                onSuccess={handleMemoryCreated}
            />
        </div>
    )
}