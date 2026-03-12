'use client'

import { useState, useRef } from 'react'
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
    Image as ImageIcon,
    X,
    Upload,
    Tag,
    FolderOpen,
    Check,
    Users
} from 'lucide-react'
import DashboardNavbar from '@/components/shared/DashboardNavbar'
import Stats from '@/components/dashboard/Stats'
import DashboardFooter from '@/components/dashboard/DashboardFooter'
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
                            <div className={styles.sectionTitleGroup}>
                                <Calendar className={styles.sectionIcon} />
                                <div>
                                    <h2 className={styles.sectionTitle}>On This Day</h2>
                                    <p className={styles.sectionSubtitle}>Memories from years past</p>
                                </div>
                            </div>
                            <Link href="/timeline" className={styles.viewAllLink}>
                                View all <ChevronRight />
                            </Link>
                        </div>

                        <div className={styles.onThisDayGrid}>
                            {onThisDayMemories.map((memory) => (
                                <Link
                                    key={memory.id}
                                    href={`/memory/${memory.id}`}
                                    className={styles.onThisDayCard}
                                >
                                    <div className={styles.onThisDayEmoji}>{memory.emoji}</div>
                                    <div className={styles.onThisDayInfo}>
                                        <h3>{memory.title}</h3>
                                        <p>{memory.year} • {memory.location || 'Unknown location'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            <Stats data={stats} />

            {/* Recent Memories Section */}
            <section className={styles.recentMemories}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitleGroup}>
                            <ImageIcon className={styles.sectionIcon} />
                            <div>
                                <h2 className={styles.sectionTitle}>Recent Memories</h2>
                                <p className={styles.sectionSubtitle}>Latest additions to your collection</p>
                            </div>
                        </div>
                        <Link href="/gallery" className={styles.viewAllLink}>
                            View all <ChevronRight />
                        </Link>
                    </div>

                    <div className={styles.memoriesGrid}>
                        {recentMemories.slice(0, 8).map((memory) => (
                            <Link
                                key={memory.id}
                                href={`/memory/${memory.id}`}
                                className={styles.memoryCard}
                            >
                                <div className={styles.memoryImage}>
                                    {memory.fileUrl && !imageErrors.has(`recent-${memory.id}`) ? (
                                        <Image
                                            src={memory.thumbnailUrl || memory.fileUrl}
                                            alt={memory.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            onError={() => handleImageError(`recent-${memory.id}`)}
                                        />
                                    ) : (
                                        <div className={styles.memoryPlaceholder}>
                                            <ImageIcon />
                                        </div>
                                    )}
                                    {getTypeIcon(memory.type)}
                                    {memory.commentCount > 0 && (
                                        <div className={styles.commentBadge}>
                                            <MessageCircle />
                                            <span>{memory.commentCount}</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.memoryInfo}>
                                    <h3 className={styles.memoryTitle}>{memory.title}</h3>
                                    <div className={styles.memoryMeta}>
                                        <span><Calendar /> {memory.date}</span>
                                        {memory.location && (
                                            <span><MapPin /> {memory.location}</span>
                                        )}
                                    </div>
                                    {memory.tags.length > 0 && (
                                        <div className={styles.memoryTags}>
                                            {memory.tags.slice(0, 2).map(tag => (
                                                <span
                                                    key={tag.id}
                                                    className={styles.tag}
                                                    style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                            {memory.tags.length > 2 && (
                                                <span className={styles.tagMore}>+{memory.tags.length - 2}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <DashboardFooter />

            {/* Add Memory Modal */}
            {showAddModal && (
                <AddMemoryModal onClose={() => setShowAddModal(false)} />
            )}
        </div>
    )
}

// Add Memory Modal Component
function AddMemoryModal({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dateTaken, setDateTaken] = useState('')
    const [location, setLocation] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [availableTags, setAvailableTags] = useState<Array<{ id: string; name: string; color: string | null }>>([])
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
    const [availableAlbums, setAvailableAlbums] = useState<Array<{ id: string; name: string }>>([])
    const [selectedAlbums, setSelectedAlbums] = useState<Set<string>>(new Set())
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Fetch tags and albums on mount
    useState(() => {
        fetch('/api/tags').then(r => r.ok ? r.json() : []).then(setAvailableTags).catch(() => { })
        fetch('/api/albums/list').then(r => r.ok ? r.json() : []).then(setAvailableAlbums).catch(() => { })
    })

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile)
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result as string)
        reader.readAsDataURL(selectedFile)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) handleFileSelect(droppedFile)
    }

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev => {
            const newSet = new Set(prev)
            newSet.has(tagId) ? newSet.delete(tagId) : newSet.add(tagId)
            return newSet
        })
    }

    const toggleAlbum = (albumId: string) => {
        setSelectedAlbums(prev => {
            const newSet = new Set(prev)
            newSet.has(albumId) ? newSet.delete(albumId) : newSet.add(albumId)
            return newSet
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) { setError('Title is required'); return }
        if (!file) { setError('Please select a file'); return }

        setIsSubmitting(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', title.trim())
            formData.append('description', description.trim())
            if (dateTaken) formData.append('dateTaken', dateTaken)
            if (location) formData.append('location', location.trim())
            formData.append('tagIds', JSON.stringify(Array.from(selectedTags)))
            formData.append('albumIds', JSON.stringify(Array.from(selectedAlbums)))

            const response = await fetch('/api/memories', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) throw new Error('Failed to create memory')

            onClose()
            window.location.reload()
        } catch (err) {
            setError('Failed to save memory. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Add New Memory</h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    {error && <div className={styles.modalError}>{error}</div>}

                    {/* File Upload */}
                    <div
                        className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className={styles.preview} />
                        ) : (
                            <>
                                <Upload />
                                <p>Drag and drop or click to upload</p>
                                <span>JPEG, PNG, GIF, WebP, MP4 (max 50MB)</span>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                            hidden
                        />
                    </div>

                    {/* Title */}
                    <div className={styles.formGroup}>
                        <label>Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give this memory a title..."
                        />
                    </div>

                    {/* Description */}
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell the story behind this memory..."
                            rows={3}
                        />
                    </div>

                    {/* Date and Location */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label><Calendar /> Date</label>
                            <input
                                type="date"
                                value={dateTaken}
                                onChange={(e) => setDateTaken(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label><MapPin /> Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Where was this?"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    {availableTags.length > 0 && (
                        <div className={styles.formGroup}>
                            <label><Tag /> Tags</label>
                            <div className={styles.chipGrid}>
                                {availableTags.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        className={`${styles.chip} ${selectedTags.has(tag.id) ? styles.chipSelected : ''}`}
                                        onClick={() => toggleTag(tag.id)}
                                        style={tag.color ? { borderColor: tag.color } : undefined}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Albums */}
                    {availableAlbums.length > 0 && (
                        <div className={styles.formGroup}>
                            <label><FolderOpen /> Add to Albums</label>
                            <div className={styles.albumChipGrid}>
                                {availableAlbums.map(album => (
                                    <button
                                        key={album.id}
                                        type="button"
                                        className={`${styles.albumChip} ${selectedAlbums.has(album.id) ? styles.albumChipSelected : ''}`}
                                        onClick={() => toggleAlbum(album.id)}
                                    >
                                        <FolderOpen />
                                        <span>{album.name}</span>
                                        {selectedAlbums.has(album.id) && <Check />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.btnSecondary}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className={styles.btnPrimary}>
                            {isSubmitting ? 'Saving...' : '✓ Save Memory'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}