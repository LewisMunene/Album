'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Share2,
    Calendar,
    MapPin,
    User,
    Tag,
    FolderOpen,
    Eye,
    Send,
    MoreHorizontal,
    Trash2,
    Edit,
    Play
} from 'lucide-react'
import styles from './MemoryDetail.module.css'

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
    uploadedBy: {
        id: string
        name: string | null
        avatar: string | null
    }
    people: Array<{
        id: string
        firstName: string
        lastName: string
        nickname: string | null
        profilePhoto: string | null
    }>
    tags: Array<{
        id: string
        name: string
        color: string | null
    }>
    albums: Array<{
        id: string
        name: string
    }>
    comments: Array<{
        id: string
        content: string
        createdAt: string
        author: {
            id: string
            name: string | null
            avatar: string | null
        }
    }>
}

interface CurrentUser {
    id: string
    name?: string | null
    email?: string | null
}

interface MemoryDetailClientProps {
    memory: Memory
    currentUser: CurrentUser
}

export default function MemoryDetailClient({ memory, currentUser }: MemoryDetailClientProps) {
    const router = useRouter()
    const [newComment, setNewComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [comments, setComments] = useState(memory.comments)
    const [showMenu, setShowMenu] = useState(false)
    const [imageError, setImageError] = useState(false)

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(dateString))
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
        return formatDate(dateString)
    }

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/memories/${memory.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment.trim() })
            })

            if (response.ok) {
                const data = await response.json()
                setComments([data.comment, ...comments])
                setNewComment('')
            }
        } catch (error) {
            console.error('Failed to post comment:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this memory? This cannot be undone.')) {
            return
        }

        try {
            const response = await fetch(`/api/memories/${memory.id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                router.push('/album')
            }
        } catch (error) {
            console.error('Failed to delete memory:', error)
        }
    }

    const isOwner = currentUser.id === memory.uploadedBy.id

    const hasValidImage = !imageError && memory.fileUrl && !memory.fileUrl.includes('placeholder')

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>

                <div className={styles.headerActions}>
                    <button className={styles.actionBtn}>
                        <Heart />
                    </button>
                    <button className={styles.actionBtn}>
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
                                <div className={styles.menu}>
                                    <button className={styles.menuItem}>
                                        <Edit /> Edit
                                    </button>
                                    <button
                                        className={`${styles.menuItem} ${styles.menuItemDanger}`}
                                        onClick={handleDelete}
                                    >
                                        <Trash2 /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <div className={styles.content}>
                {/* Media Section */}
                <div className={styles.mediaSection}>
                    <div className={styles.mediaContainer}>
                        {memory.type === 'VIDEO' ? (
                            <video
                                src={memory.fileUrl}
                                controls
                                className={styles.video}
                                poster={memory.thumbnailUrl || undefined}
                            />
                        ) : memory.type === 'STORY' ? (
                            <div className={styles.storyContainer}>
                                <div className={styles.storyIcon}>📖</div>
                                <p className={styles.storyText}>{memory.description}</p>
                            </div>
                        ) : hasValidImage ? (
                            <Image
                                src={memory.fileUrl}
                                alt={memory.title}
                                fill
                                className={styles.image}
                                onError={() => setImageError(true)}
                                priority
                            />
                        ) : (
                            <div className={styles.placeholder}>
                                <span>📷</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className={styles.detailsSection}>
                    <h1 className={styles.title}>{memory.title}</h1>

                    {memory.description && memory.type !== 'STORY' && (
                        <p className={styles.description}>{memory.description}</p>
                    )}

                    {/* Meta Info */}
                    <div className={styles.metaGrid}>
                        {memory.dateTaken && (
                            <div className={styles.metaItem}>
                                <Calendar className={styles.metaIcon} />
                                <div>
                                    <p className={styles.metaLabel}>Date</p>
                                    <p className={styles.metaValue}>{formatDate(memory.dateTaken)}</p>
                                </div>
                            </div>
                        )}
                        {memory.location && (
                            <div className={styles.metaItem}>
                                <MapPin className={styles.metaIcon} />
                                <div>
                                    <p className={styles.metaLabel}>Location</p>
                                    <p className={styles.metaValue}>{memory.location}</p>
                                </div>
                            </div>
                        )}
                        <div className={styles.metaItem}>
                            <User className={styles.metaIcon} />
                            <div>
                                <p className={styles.metaLabel}>Uploaded by</p>
                                <p className={styles.metaValue}>{memory.uploadedBy.name || 'Unknown'}</p>
                            </div>
                        </div>
                        <div className={styles.metaItem}>
                            <Eye className={styles.metaIcon} />
                            <div>
                                <p className={styles.metaLabel}>Views</p>
                                <p className={styles.metaValue}>{memory.viewCount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tagged People */}
                    {memory.people.length > 0 && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <User /> People in this memory
                            </h3>
                            <div className={styles.peopleList}>
                                {memory.people.map(person => (
                                    <Link
                                        key={person.id}
                                        href={`/family/${person.id}`}
                                        className={styles.personChip}
                                    >
                                        <div className={styles.personAvatar}>
                                            {person.profilePhoto ? (
                                                <Image
                                                    src={person.profilePhoto}
                                                    alt={person.firstName}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span>{person.firstName[0]}</span>
                                            )}
                                        </div>
                                        <span>{person.firstName} {person.lastName}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {memory.tags.length > 0 && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <Tag /> Tags
                            </h3>
                            <div className={styles.tagList}>
                                {memory.tags.map(tag => (
                                    <span
                                        key={tag.id}
                                        className={styles.tag}
                                        style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Albums */}
                    {memory.albums.length > 0 && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <FolderOpen /> Albums
                            </h3>
                            <div className={styles.albumList}>
                                {memory.albums.map(album => (
                                    <Link
                                        key={album.id}
                                        href={`/albums/${album.id}`}
                                        className={styles.albumChip}
                                    >
                                        📁 {album.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className={styles.commentsSection}>
                        <h3 className={styles.sectionTitle}>
                            <MessageCircle /> Comments ({comments.length})
                        </h3>

                        {/* Comment Form */}
                        <form onSubmit={handleSubmitComment} className={styles.commentForm}>
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className={styles.commentInput}
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim() || isSubmitting}
                                className={styles.commentSubmit}
                            >
                                <Send />
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className={styles.commentsList}>
                            {comments.length === 0 ? (
                                <p className={styles.noComments}>
                                    No comments yet. Be the first to share your thoughts!
                                </p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className={styles.comment}>
                                        <div className={styles.commentAvatar}>
                                            {comment.author.avatar ? (
                                                <Image
                                                    src={comment.author.avatar}
                                                    alt={comment.author.name || 'User'}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span>{(comment.author.name || 'U')[0]}</span>
                                            )}
                                        </div>
                                        <div className={styles.commentContent}>
                                            <div className={styles.commentHeader}>
                                                <span className={styles.commentAuthor}>
                                                    {comment.author.name || 'Unknown'}
                                                </span>
                                                <span className={styles.commentTime}>
                                                    {formatTimeAgo(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className={styles.commentText}>{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}