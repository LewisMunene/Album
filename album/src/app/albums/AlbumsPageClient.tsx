'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Heart,
    Plus,
    FolderOpen,
    Image as ImageIcon,
    Search,
    Grid3X3,
    List,
    Calendar,
    User as UserIcon,
    X
} from 'lucide-react'
import styles from './AlbumsPage.module.css'

interface Album {
    id: string
    name: string
    description: string | null
    coverImageUrl: string | null
    memoryCount: number
    previewImages: string[]
    createdBy: {
        id: string
        name: string | null
        avatar: string | null
    }
    createdAt: string
}

interface UserData {
    id: string
    name?: string | null
    email?: string | null
}

interface AlbumsPageClientProps {
    albums: Album[]
    user: UserData
    stats: {
        totalAlbums: number
        totalMemories: number
    }
}

export default function AlbumsPageClient({ albums, user, stats }: AlbumsPageClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

    // Filter albums by search
    const filteredAlbums = albums.filter(album =>
        album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleImageError = (albumId: string) => {
        setImageErrors(prev => new Set([...prev, albumId]))
    }

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(dateString))
    }

    return (
        <div className={styles.page}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={styles.navInner}>
                    <Link href="/album" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Heart />
                        </div>
                        <span className={styles.logoText}>
                            Muthee<span className={styles.logoTextMuted}>Family</span>
                        </span>
                    </Link>

                    <div className={styles.navLinks}>
                        <Link href="/album" className={styles.navLink}>Memories</Link>
                        <Link href="/albums" className={`${styles.navLink} ${styles.navLinkActive}`}>Albums</Link>
                        <Link href="/timeline" className={styles.navLink}>Timeline</Link>
                        <Link href="/family" className={styles.navLink}>Family</Link>
                    </div>

                    <div className={styles.navActions}>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className={styles.addButton}
                        >
                            <Plus />
                            <span>New Album</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerText}>
                        <h1 className={styles.title}>
                            <FolderOpen className={styles.titleIcon} />
                            Photo Albums
                        </h1>
                        <p className={styles.subtitle}>
                            {stats.totalAlbums} albums · {stats.totalMemories} memories
                        </p>
                    </div>

                    <div className={styles.headerActions}>
                        {/* Search */}
                        <div className={styles.searchBar}>
                            <Search />
                            <input
                                type="text"
                                placeholder="Search albums..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* View Toggle */}
                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 />
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {filteredAlbums.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <FolderOpen />
                        </div>
                        <h2>No albums yet</h2>
                        <p>Create your first album to organize your family memories</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className={styles.emptyButton}
                        >
                            <Plus /> Create Album
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className={styles.albumGrid}>
                        {filteredAlbums.map(album => (
                            <Link
                                key={album.id}
                                href={`/albums/${album.id}`}
                                className={styles.albumCard}
                            >
                                <div className={styles.albumCover}>
                                    {album.coverImageUrl && !imageErrors.has(album.id) ? (
                                        <Image
                                            src={album.coverImageUrl}
                                            alt={album.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            onError={() => handleImageError(album.id)}
                                        />
                                    ) : (
                                        <div className={styles.albumCoverPlaceholder}>
                                            <FolderOpen />
                                        </div>
                                    )}
                                    <div className={styles.albumOverlay}>
                                        <span className={styles.albumCount}>
                                            <ImageIcon /> {album.memoryCount}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.albumInfo}>
                                    <h3 className={styles.albumName}>{album.name}</h3>
                                    {album.description && (
                                        <p className={styles.albumDescription}>{album.description}</p>
                                    )}
                                    <div className={styles.albumMeta}>
                                        <span><Calendar /> {formatDate(album.createdAt)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Create New Album Card */}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className={styles.createAlbumCard}
                        >
                            <div className={styles.createAlbumIcon}>
                                <Plus />
                            </div>
                            <span>Create New Album</span>
                        </button>
                    </div>
                ) : (
                    <div className={styles.albumList}>
                        {filteredAlbums.map(album => (
                            <Link
                                key={album.id}
                                href={`/albums/${album.id}`}
                                className={styles.albumListItem}
                            >
                                <div className={styles.albumListCover}>
                                    {album.coverImageUrl && !imageErrors.has(album.id) ? (
                                        <Image
                                            src={album.coverImageUrl}
                                            alt={album.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            onError={() => handleImageError(album.id)}
                                        />
                                    ) : (
                                        <FolderOpen />
                                    )}
                                </div>
                                <div className={styles.albumListInfo}>
                                    <h3>{album.name}</h3>
                                    {album.description && <p>{album.description}</p>}
                                </div>
                                <div className={styles.albumListMeta}>
                                    <span><ImageIcon /> {album.memoryCount} memories</span>
                                    <span><Calendar /> {formatDate(album.createdAt)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Album Modal */}
            {showCreateModal && (
                <CreateAlbumModal onClose={() => setShowCreateModal(false)} />
            )}
        </div>
    )
}

// Create Album Modal Component
function CreateAlbumModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            setError('Album name is required')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const response = await fetch('/api/albums', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), description: description.trim() || null })
            })

            if (!response.ok) {
                throw new Error('Failed to create album')
            }

            window.location.reload()
        } catch (err) {
            setError('Failed to create album. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Create New Album</h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    {error && (
                        <div className={styles.modalError}>{error}</div>
                    )}

                    <div className={styles.formGroup}>
                        <label>Album Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Summer Vacation 2024"
                            autoFocus
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a description for this album..."
                            rows={3}
                        />
                    </div>

                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.btnSecondary}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.btnPrimary}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Album'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}