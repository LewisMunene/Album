'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Search,
    Filter,
    Grid3X3,
    LayoutGrid,
    Calendar,
    MapPin,
    Tag,
    X,
    Play,
    FileText,
    Image as ImageIcon,
    MessageCircle,
    ChevronDown,
    SlidersHorizontal
} from 'lucide-react'
import DashboardNavbar from '@/components/shared/DashboardNavbar'
import DashboardFooter from '@/components/dashboard/DashboardFooter'
import styles from './GalleryPage.module.css'

interface Memory {
    id: string
    title: string
    description: string | null
    type: 'PHOTO' | 'VIDEO' | 'STORY'
    fileUrl: string
    thumbnailUrl: string | null
    dateTaken: string | null
    location: string | null
    viewCount: number
    createdAt: string
    uploadedBy: { id: string; name: string | null; avatar: string | null }
    tags: Array<{ id: string; name: string; color: string | null }>
    people: Array<{ id: string; name: string; photo: string | null }>
    albums: Array<{ id: string; name: string }>
    commentCount: number
}

interface Tag {
    id: string
    name: string
    color: string | null
}

interface Album {
    id: string
    name: string
}

interface GalleryPageClientProps {
    user: { id?: string; name?: string | null; email?: string | null }
    memories: Memory[]
    tags: Tag[]
    albums: Album[]
}

type ViewMode = 'grid' | 'masonry'
type SortOption = 'newest' | 'oldest' | 'title' | 'views'

export default function GalleryPageClient({ user, memories, tags, albums }: GalleryPageClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

    // Filter and sort memories
    const filteredMemories = useMemo(() => {
        let result = [...memories]

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter(m =>
                m.title.toLowerCase().includes(query) ||
                m.description?.toLowerCase().includes(query) ||
                m.location?.toLowerCase().includes(query) ||
                m.tags.some(t => t.name.toLowerCase().includes(query))
            )
        }

        // Tag filter
        if (selectedTags.size > 0) {
            result = result.filter(m =>
                m.tags.some(t => selectedTags.has(t.id))
            )
        }

        // Album filter
        if (selectedAlbum) {
            result = result.filter(m =>
                m.albums.some(a => a.id === selectedAlbum)
            )
        }

        // Type filter
        if (selectedType) {
            result = result.filter(m => m.type === selectedType)
        }

        // Sort
        switch (sortBy) {
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                break
            case 'title':
                result.sort((a, b) => a.title.localeCompare(b.title))
                break
            case 'views':
                result.sort((a, b) => b.viewCount - a.viewCount)
                break
            default: // newest
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }

        return result
    }, [memories, searchQuery, selectedTags, selectedAlbum, selectedType, sortBy])

    const handleImageError = (id: string) => {
        setImageErrors(prev => new Set([...prev, id]))
    }

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev => {
            const newSet = new Set(prev)
            newSet.has(tagId) ? newSet.delete(tagId) : newSet.add(tagId)
            return newSet
        })
    }

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedTags(new Set())
        setSelectedAlbum(null)
        setSelectedType(null)
    }

    const hasActiveFilters = searchQuery || selectedTags.size > 0 || selectedAlbum || selectedType

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(dateString))
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Play />
            case 'STORY': return <FileText />
            default: return null
        }
    }

    return (
        <div className={styles.page}>
            <DashboardNavbar user={user} />

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerTop}>
                        <div>
                            <h1 className={styles.title}>Gallery</h1>
                            <p className={styles.subtitle}>
                                {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'}
                                {hasActiveFilters && ' (filtered)'}
                            </p>
                        </div>

                        <div className={styles.headerActions}>
                            {/* View Toggle */}
                            <div className={styles.viewToggle}>
                                <button
                                    className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    title="Grid view"
                                >
                                    <Grid3X3 />
                                </button>
                                <button
                                    className={`${styles.viewBtn} ${viewMode === 'masonry' ? styles.viewBtnActive : ''}`}
                                    onClick={() => setViewMode('masonry')}
                                    title="Masonry view"
                                >
                                    <LayoutGrid />
                                </button>
                            </div>

                            {/* Sort */}
                            <div className={styles.sortWrapper}>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className={styles.sortSelect}
                                >
                                    <option value="newest">Newest first</option>
                                    <option value="oldest">Oldest first</option>
                                    <option value="title">By title</option>
                                    <option value="views">Most viewed</option>
                                </select>
                                <ChevronDown className={styles.sortIcon} />
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className={styles.searchFilterBar}>
                        <div className={styles.searchWrapper}>
                            <Search />
                            <input
                                type="text"
                                placeholder="Search memories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className={styles.clearSearch}
                                    onClick={() => setSearchQuery('')}
                                >
                                    <X />
                                </button>
                            )}
                        </div>

                        <button
                            className={`${styles.filterToggle} ${showFilters ? styles.filterToggleActive : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal />
                            <span>Filters</span>
                            {hasActiveFilters && <span className={styles.filterBadge} />}
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className={styles.filterPanel}>
                            {/* Type Filter */}
                            <div className={styles.filterGroup}>
                                <label>Type</label>
                                <div className={styles.filterChips}>
                                    <button
                                        className={`${styles.filterChip} ${!selectedType ? styles.filterChipActive : ''}`}
                                        onClick={() => setSelectedType(null)}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={`${styles.filterChip} ${selectedType === 'PHOTO' ? styles.filterChipActive : ''}`}
                                        onClick={() => setSelectedType('PHOTO')}
                                    >
                                        <ImageIcon /> Photos
                                    </button>
                                    <button
                                        className={`${styles.filterChip} ${selectedType === 'VIDEO' ? styles.filterChipActive : ''}`}
                                        onClick={() => setSelectedType('VIDEO')}
                                    >
                                        <Play /> Videos
                                    </button>
                                    <button
                                        className={`${styles.filterChip} ${selectedType === 'STORY' ? styles.filterChipActive : ''}`}
                                        onClick={() => setSelectedType('STORY')}
                                    >
                                        <FileText /> Stories
                                    </button>
                                </div>
                            </div>

                            {/* Album Filter */}
                            {albums.length > 0 && (
                                <div className={styles.filterGroup}>
                                    <label>Album</label>
                                    <select
                                        value={selectedAlbum || ''}
                                        onChange={(e) => setSelectedAlbum(e.target.value || null)}
                                        className={styles.filterSelect}
                                    >
                                        <option value="">All albums</option>
                                        {albums.map(album => (
                                            <option key={album.id} value={album.id}>{album.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Tags Filter */}
                            {tags.length > 0 && (
                                <div className={styles.filterGroup}>
                                    <label>Tags</label>
                                    <div className={styles.tagChips}>
                                        {tags.map(tag => (
                                            <button
                                                key={tag.id}
                                                className={`${styles.tagChip} ${selectedTags.has(tag.id) ? styles.tagChipActive : ''}`}
                                                onClick={() => toggleTag(tag.id)}
                                                style={tag.color ? { borderColor: tag.color } : undefined}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <button className={styles.clearFilters} onClick={clearFilters}>
                                    <X /> Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Gallery Grid */}
            <main className={styles.main}>
                <div className={styles.mainContainer}>
                    {filteredMemories.length === 0 ? (
                        <div className={styles.emptyState}>
                            <ImageIcon />
                            <h2>No memories found</h2>
                            <p>
                                {hasActiveFilters
                                    ? 'Try adjusting your filters or search query'
                                    : 'Start by adding your first memory'}
                            </p>
                            {hasActiveFilters && (
                                <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className={`${styles.gallery} ${viewMode === 'masonry' ? styles.galleryMasonry : ''}`}>
                            {filteredMemories.map(memory => (
                                <Link
                                    key={memory.id}
                                    href={`/memory/${memory.id}`}
                                    className={styles.memoryCard}
                                >
                                    <div className={styles.memoryImage}>
                                        {memory.fileUrl && !imageErrors.has(memory.id) ? (
                                            <Image
                                                src={memory.thumbnailUrl || memory.fileUrl}
                                                alt={memory.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                onError={() => handleImageError(memory.id)}
                                            />
                                        ) : (
                                            <div className={styles.memoryPlaceholder}>
                                                <ImageIcon />
                                            </div>
                                        )}

                                        {/* Type Badge */}
                                        {memory.type !== 'PHOTO' && (
                                            <div className={styles.typeBadge}>
                                                {getTypeIcon(memory.type)}
                                            </div>
                                        )}

                                        {/* Comment Badge */}
                                        {memory.commentCount > 0 && (
                                            <div className={styles.commentBadge}>
                                                <MessageCircle />
                                                <span>{memory.commentCount}</span>
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className={styles.memoryOverlay}>
                                            <h3>{memory.title}</h3>
                                            {memory.tags.length > 0 && (
                                                <div className={styles.overlayTags}>
                                                    {memory.tags.slice(0, 3).map(tag => (
                                                        <span key={tag.id}>{tag.name}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.memoryInfo}>
                                        <h3 className={styles.memoryTitle}>{memory.title}</h3>
                                        <div className={styles.memoryMeta}>
                                            <span>
                                                <Calendar />
                                                {formatDate(memory.dateTaken || memory.createdAt)}
                                            </span>
                                            {memory.location && (
                                                <span>
                                                    <MapPin />
                                                    {memory.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <DashboardFooter />
        </div>
    )
}