'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Plus,
    MoreHorizontal,
    Calendar,
    MapPin,
    User,
    Image as ImageIcon,
    Play,
    FileText,
    Edit,
    Trash2,
    Share2,
    X,
    Check,
    Loader2,
    Upload,
    FolderPlus,
    Copy,
    Link as LinkIcon,
    Facebook,
    Twitter,
    Mail
} from 'lucide-react'
import styles from './AlbumDetail.module.css'

interface Memory {
    id: string
    title: string
    description: string | null
    type: 'PHOTO' | 'VIDEO' | 'STORY'
    fileUrl: string
    thumbnailUrl: string | null
    dateTaken: string | null
    location: string | null
    uploadedBy: { id: string; name: string | null }
    people?: Array<{ id: string; name: string }>
    tags?: string[]
}

interface Album {
    id: string
    name: string
    description: string | null
    coverImageUrl: string | null
    createdBy: { id: string; name: string | null; avatar: string | null }
    createdAt: string
    memories: Memory[]
}

interface Tag {
    id: string
    name: string
    color: string | null
}

interface AlbumDetailClientProps {
    album: Album
    user: { id: string; name?: string | null }
    tags?: Tag[]
}

export default function AlbumDetailClient({ album: initialAlbum, user, tags = [] }: AlbumDetailClientProps) {
    const router = useRouter()
    const [album, setAlbum] = useState(initialAlbum)
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
    const [showMenu, setShowMenu] = useState(false)
    const [showAddOptions, setShowAddOptions] = useState(false)
    const [showAddExistingModal, setShowAddExistingModal] = useState(false)
    const [showCreateNewModal, setShowCreateNewModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)

    const handleImageError = (id: string) => {
        setImageErrors(prev => new Set([...prev, id]))
    }

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(dateString))
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Play />
            case 'STORY': return <FileText />
            default: return <ImageIcon />
        }
    }

    const isOwner = user.id === album.createdBy.id

    const handleAlbumUpdate = (updatedAlbum: Partial<Album>) => {
        setAlbum(prev => ({ ...prev, ...updatedAlbum }))
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link href="/albums" className={styles.backBtn}>
                        <ArrowLeft />
                        <span>All Albums</span>
                    </Link>

                    <div className={styles.headerActions}>
                        {/* Add Memories Dropdown */}
                        <div className={styles.addDropdownWrapper}>
                            <button
                                className={styles.addMemoriesBtn}
                                onClick={() => setShowAddOptions(!showAddOptions)}
                            >
                                <Plus />
                                <span>Add Memories</span>
                            </button>

                            {showAddOptions && (
                                <>
                                    <div
                                        className={styles.dropdownBackdrop}
                                        onClick={() => setShowAddOptions(false)}
                                    />
                                    <div className={styles.addDropdown}>
                                        <button
                                            className={styles.addDropdownItem}
                                            onClick={() => {
                                                setShowAddOptions(false)
                                                setShowCreateNewModal(true)
                                            }}
                                        >
                                            <Upload />
                                            <div>
                                                <span>Upload New</span>
                                                <p>Add new photos to this album</p>
                                            </div>
                                        </button>
                                        <button
                                            className={styles.addDropdownItem}
                                            onClick={() => {
                                                setShowAddOptions(false)
                                                setShowAddExistingModal(true)
                                            }}
                                        >
                                            <FolderPlus />
                                            <div>
                                                <span>Add Existing</span>
                                                <p>Choose from your memories</p>
                                            </div>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            className={styles.actionBtn}
                            onClick={() => setShowShareModal(true)}
                            title="Share album"
                        >
                            <Share2 />
                        </button>

                        {isOwner && (
                            <div className={styles.menuWrapper}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => setShowMenu(!showMenu)}
                                >
                                    <MoreHorizontal />
                                </button>
                                {showMenu && (
                                    <>
                                        <div
                                            className={styles.dropdownBackdrop}
                                            onClick={() => setShowMenu(false)}
                                        />
                                        <div className={styles.menu}>
                                            <button
                                                className={styles.menuItem}
                                                onClick={() => {
                                                    setShowMenu(false)
                                                    setShowEditModal(true)
                                                }}
                                            >
                                                <Edit /> Edit Album
                                            </button>
                                            <button
                                                className={`${styles.menuItem} ${styles.menuItemDanger}`}
                                                onClick={() => {
                                                    setShowMenu(false)
                                                    setShowDeleteModal(true)
                                                }}
                                            >
                                                <Trash2 /> Delete Album
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Album Info */}
            <div className={styles.albumInfo}>
                <div className={styles.albumInfoInner}>
                    <h1 className={styles.albumTitle}>{album.name}</h1>
                    {album.description && (
                        <p className={styles.albumDescription}>{album.description}</p>
                    )}
                    <div className={styles.albumMeta}>
                        <span>
                            <ImageIcon /> {album.memories.length} memories
                        </span>
                        <span>
                            <User /> {album.createdBy.name || 'Unknown'}
                        </span>
                        <span>
                            <Calendar /> {formatDate(album.createdAt)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Memories Grid */}
            <main className={styles.main}>
                {album.memories.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <ImageIcon />
                        </div>
                        <h2>No memories in this album</h2>
                        <p>Add some memories to get started</p>
                        <div className={styles.emptyActions}>
                            <button
                                onClick={() => setShowCreateNewModal(true)}
                                className={styles.emptyButtonPrimary}
                            >
                                <Upload /> Upload New
                            </button>
                            <button
                                onClick={() => setShowAddExistingModal(true)}
                                className={styles.emptyButtonSecondary}
                            >
                                <FolderPlus /> Add Existing
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.memoriesGrid}>
                        {album.memories.map(memory => (
                            <Link
                                key={memory.id}
                                href={`/memory/${memory.id}`}
                                className={styles.memoryCard}
                            >
                                <div className={styles.memoryImage}>
                                    {memory.fileUrl && !imageErrors.has(memory.id) && memory.type !== 'STORY' ? (
                                        <>
                                            <Image
                                                src={memory.thumbnailUrl || memory.fileUrl}
                                                alt={memory.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                onError={() => handleImageError(memory.id)}
                                            />
                                            {memory.type === 'VIDEO' && (
                                                <div className={styles.videoOverlay}>
                                                    <Play />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className={styles.memoryPlaceholder}>
                                            {getTypeIcon(memory.type)}
                                        </div>
                                    )}
                                    <div className={styles.memoryType}>
                                        {getTypeIcon(memory.type)}
                                    </div>
                                </div>
                                <div className={styles.memoryInfo}>
                                    <h3>{memory.title}</h3>
                                    <div className={styles.memoryMeta}>
                                        {memory.dateTaken && (
                                            <span><Calendar /> {formatDate(memory.dateTaken)}</span>
                                        )}
                                        {memory.location && (
                                            <span><MapPin /> {memory.location}</span>
                                        )}
                                    </div>
                                    {memory.people && memory.people.length > 0 && (
                                        <div className={styles.memoryPeople}>
                                            <User />
                                            <span>{memory.people.map(p => p.name).join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Modals */}
            {showAddExistingModal && (
                <AddExistingMemoriesModal
                    albumId={album.id}
                    onClose={() => setShowAddExistingModal(false)}
                />
            )}

            {showCreateNewModal && (
                <CreateMemoryModal
                    albumId={album.id}
                    tags={tags}
                    onClose={() => setShowCreateNewModal(false)}
                />
            )}

            {showEditModal && (
                <EditAlbumModal
                    album={album}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleAlbumUpdate}
                />
            )}

            {showDeleteModal && (
                <DeleteAlbumModal
                    album={album}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}

            {showShareModal && (
                <ShareAlbumModal
                    album={album}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    )
}

// ============================================
// EDIT ALBUM MODAL
// ============================================
function EditAlbumModal({
    album,
    onClose,
    onSave
}: {
    album: Album
    onClose: () => void
    onSave: (updated: Partial<Album>) => void
}) {
    const [name, setName] = useState(album.name)
    const [description, setDescription] = useState(album.description || '')
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
            const response = await fetch(`/api/albums/${album.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || null
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to update album')
            }

            const updatedAlbum = await response.json()
            onSave({ name: updatedAlbum.name, description: updatedAlbum.description })
            onClose()
        } catch (err: any) {
            setError(err.message || 'Failed to update album')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.editModal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Edit Album</h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    {error && <div className={styles.modalError}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label>Album Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter album name..."
                            autoFocus
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a description..."
                            rows={3}
                        />
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.btnSecondary}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className={styles.btnPrimary}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ============================================
// DELETE ALBUM MODAL
// ============================================
function DeleteAlbumModal({
    album,
    onClose
}: {
    album: Album
    onClose: () => void
}) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState('')
    const [confirmText, setConfirmText] = useState('')

    const handleDelete = async () => {
        if (confirmText !== album.name) {
            setError('Please type the album name to confirm')
            return
        }

        setIsDeleting(true)
        setError('')

        try {
            const response = await fetch(`/api/albums/${album.id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete album')
            }

            router.push('/albums')
        } catch (err: any) {
            setError(err.message || 'Failed to delete album')
            setIsDeleting(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.deleteModal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Delete Album</h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                <div className={styles.deleteContent}>
                    <div className={styles.deleteWarning}>
                        <Trash2 />
                    </div>
                    <p>
                        Are you sure you want to delete <strong>"{album.name}"</strong>?
                        This action cannot be undone.
                    </p>
                    <p className={styles.deleteNote}>
                        Note: The memories in this album will not be deleted, only removed from the album.
                    </p>

                    {error && <div className={styles.modalError}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label>Type <strong>{album.name}</strong> to confirm:</label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type album name..."
                        />
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.btnSecondary}>
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting || confirmText !== album.name}
                            className={styles.btnDanger}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Album'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================
// SHARE ALBUM MODAL
// ============================================
function ShareAlbumModal({
    album,
    onClose
}: {
    album: Album
    onClose: () => void
}) {
    const [copied, setCopied] = useState(false)
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/albums/${album.id}`
        : ''

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const shareToFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=400'
        )
    }

    const shareToTwitter = () => {
        const text = `Check out this album: ${album.name}`
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=400'
        )
    }

    const shareByEmail = () => {
        const subject = `Check out this album: ${album.name}`
        const body = `I wanted to share this family album with you:\n\n${album.name}\n${album.description || ''}\n\nView it here: ${shareUrl}`
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.shareModal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Share Album</h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                <div className={styles.shareContent}>
                    <p className={styles.shareAlbumName}>"{album.name}"</p>

                    {/* Copy Link */}
                    <div className={styles.copyLinkSection}>
                        <div className={styles.linkDisplay}>
                            <LinkIcon />
                            <span>{shareUrl}</span>
                        </div>
                        <button onClick={copyLink} className={styles.copyBtn}>
                            {copied ? <Check /> : <Copy />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    {/* Social Share */}
                    <div className={styles.socialShare}>
                        <p>Share via:</p>
                        <div className={styles.socialButtons}>
                            <button onClick={shareToFacebook} className={styles.socialBtn} title="Share on Facebook">
                                <Facebook />
                            </button>
                            <button onClick={shareToTwitter} className={styles.socialBtn} title="Share on Twitter">
                                <Twitter />
                            </button>
                            <button onClick={shareByEmail} className={styles.socialBtn} title="Share via Email">
                                <Mail />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================
// ADD EXISTING MEMORIES MODAL
// ============================================
function AddExistingMemoriesModal({ albumId, onClose }: { albumId: string; onClose: () => void }) {
    const [memories, setMemories] = useState<Memory[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetchAvailableMemories()
    }, [albumId])

    const fetchAvailableMemories = async () => {
        try {
            const response = await fetch(`/api/albums/${albumId}/memories`)
            if (!response.ok) throw new Error('Failed to fetch memories')
            const data = await response.json()
            setMemories(data)
        } catch (err) {
            setError('Failed to load memories')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev)
            newSet.has(id) ? newSet.delete(id) : newSet.add(id)
            return newSet
        })
    }

    const selectAll = () => {
        if (selectedIds.size === memories.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(memories.map(m => m.id)))
        }
    }

    const handleSubmit = async () => {
        if (selectedIds.size === 0) {
            setError('Please select at least one memory')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const response = await fetch(`/api/albums/${albumId}/memories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memoryIds: Array.from(selectedIds) })
            })

            if (!response.ok) throw new Error('Failed to add memories')

            window.location.reload()
        } catch (err) {
            setError('Failed to add memories. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleImageError = (id: string) => {
        setImageErrors(prev => new Set([...prev, id]))
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.addMemoriesModal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Add Existing Memories</h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                {error && <div className={styles.modalError}>{error}</div>}

                <div className={styles.modalToolbar}>
                    <button onClick={selectAll} className={styles.selectAllBtn}>
                        {selectedIds.size === memories.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <span className={styles.selectedCount}>{selectedIds.size} selected</span>
                </div>

                <div className={styles.memoriesPickerGrid}>
                    {isLoading ? (
                        <div className={styles.loadingState}>
                            <Loader2 className={styles.spinner} />
                            <p>Loading memories...</p>
                        </div>
                    ) : memories.length === 0 ? (
                        <div className={styles.emptyPickerState}>
                            <ImageIcon />
                            <p>All memories are already in this album</p>
                        </div>
                    ) : (
                        memories.map(memory => (
                            <div
                                key={memory.id}
                                className={`${styles.memoryPickerCard} ${selectedIds.has(memory.id) ? styles.selected : ''}`}
                                onClick={() => toggleSelection(memory.id)}
                            >
                                <div className={styles.memoryPickerImage}>
                                    {memory.fileUrl && !imageErrors.has(memory.id) ? (
                                        <Image
                                            src={memory.thumbnailUrl || memory.fileUrl}
                                            alt={memory.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            onError={() => handleImageError(memory.id)}
                                        />
                                    ) : (
                                        <div className={styles.memoryPickerPlaceholder}>
                                            <ImageIcon />
                                        </div>
                                    )}
                                    {selectedIds.has(memory.id) && (
                                        <div className={styles.selectedOverlay}>
                                            <Check />
                                        </div>
                                    )}
                                </div>
                                <p className={styles.memoryPickerTitle}>{memory.title}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.modalActions}>
                    <button type="button" onClick={onClose} className={styles.btnSecondary}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || selectedIds.size === 0}
                        className={styles.btnPrimary}
                    >
                        {isSubmitting ? 'Adding...' : `Add ${selectedIds.size} Memories`}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================
// CREATE NEW MEMORY MODAL
// ============================================
interface CreateMemoryModalProps {
    albumId: string
    tags: Tag[]
    onClose: () => void
}

function CreateMemoryModal({ albumId, tags, onClose }: CreateMemoryModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dateTaken, setDateTaken] = useState('')
    const [location, setLocation] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [dragActive, setDragActive] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return

        const newFiles = Array.from(selectedFiles)
        setFiles(prev => [...prev, ...newFiles])

        newFiles.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
        handleFileSelect(e.dataTransfer.files)
    }

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev => {
            const newSet = new Set(prev)
            newSet.has(tagId) ? newSet.delete(tagId) : newSet.add(tagId)
            return newSet
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() && files.length === 1) {
            setError('Title is required')
            return
        }

        if (files.length === 0) {
            setError('Please select at least one file')
            return
        }

        setIsSubmitting(true)
        setError('')
        setUploadProgress(0)

        try {
            const totalFiles = files.length
            let uploadedCount = 0

            for (const file of files) {
                const formData = new FormData()
                formData.append('file', file)
                const memoryTitle = files.length === 1 ? title.trim() : (title.trim() || file.name.replace(/\.[^/.]+$/, ''))
                formData.append('title', memoryTitle)
                formData.append('description', description.trim())
                if (dateTaken) formData.append('dateTaken', dateTaken)
                if (location) formData.append('location', location.trim())
                formData.append('tagIds', JSON.stringify(Array.from(selectedTags)))
                formData.append('albumIds', JSON.stringify([albumId]))

                const response = await fetch('/api/memories', {
                    method: 'POST',
                    body: formData
                })

                if (!response.ok) {
                    const data = await response.json()
                    throw new Error(data.error || 'Failed to upload')
                }

                uploadedCount++
                setUploadProgress(Math.round((uploadedCount / totalFiles) * 100))
            }

            window.location.reload()
        } catch (err: any) {
            setError(err.message || 'Failed to save memory. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.createMemoryModal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Upload New Memory</h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    {error && <div className={styles.modalError}>{error}</div>}

                    <div
                        className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input')?.click()}
                    >
                        {previews.length > 0 ? (
                            <div className={styles.previewGrid}>
                                {previews.map((preview, index) => (
                                    <div key={index} className={styles.previewItem}>
                                        <img src={preview} alt={`Preview ${index + 1}`} />
                                        <button
                                            type="button"
                                            className={styles.removePreview}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeFile(index)
                                            }}
                                        >
                                            <X />
                                        </button>
                                    </div>
                                ))}
                                <div className={styles.addMorePreview}>
                                    <Plus />
                                    <span>Add More</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload />
                                <p>Drag and drop or click to upload</p>
                                <span>JPEG, PNG, GIF, WebP, MP4 (max 50MB each)</span>
                                <span className={styles.multipleHint}>You can select multiple files</span>
                            </>
                        )}
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={(e) => handleFileSelect(e.target.files)}
                            hidden
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Title {files.length <= 1 && '*'}</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={files.length > 1 ? "Shared title (or leave blank for filenames)" : "Give this memory a title..."}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell the story behind this memory..."
                            rows={3}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label><Calendar className={styles.labelIcon} /> Date</label>
                            <input
                                type="date"
                                value={dateTaken}
                                onChange={(e) => setDateTaken(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label><MapPin className={styles.labelIcon} /> Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Where was this?"
                            />
                        </div>
                    </div>

                    {tags.length > 0 && (
                        <div className={styles.formGroup}>
                            <label>Tags</label>
                            <div className={styles.tagGrid}>
                                {tags.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        className={`${styles.tagChip} ${selectedTags.has(tag.id) ? styles.tagSelected : ''}`}
                                        onClick={() => toggleTag(tag.id)}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {isSubmitting && files.length > 1 && (
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
                            <span>{uploadProgress}% uploaded</span>
                        </div>
                    )}

                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.btnSecondary}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className={styles.btnPrimary}>
                            {isSubmitting ? `Uploading${files.length > 1 ? ` (${uploadProgress}%)` : '...'}` : `Upload ${files.length || ''} ${files.length === 1 ? 'Memory' : 'Memories'}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}