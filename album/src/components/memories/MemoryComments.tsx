'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MessageCircle, Send, Trash2, User } from 'lucide-react'
import type { Memory } from '@/app/memory/[id]/MemoryDetailClient'
import styles from '@/app/memory/[id]/MemoryDetail.module.css'

interface MemoryCommentsProps {
    memory: Memory
    user: { id: string; name?: string | null }
    onCommentAdded: (comment: Memory['comments'][0]) => void
    onCommentDeleted: (commentId: string) => void
}

export default function MemoryComments({
    memory,
    user,
    onCommentAdded,
    onCommentDeleted
}: MemoryCommentsProps) {
    const [newComment, setNewComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()

        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newComment.trim() || isSubmitting) return

        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/memories/${memory.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment.trim() })
            })

            if (!response.ok) throw new Error('Failed to post comment')

            const comment = await response.json()
            onCommentAdded(comment)
            setNewComment('')
        } catch (error) {
            console.error('Error posting comment:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (commentId: string) => {
        if (deletingId) return

        setDeletingId(commentId)

        try {
            const response = await fetch(`/api/memories/${memory.id}/comments?commentId=${commentId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete comment')

            onCommentDeleted(commentId)
        } catch (error) {
            console.error('Error deleting comment:', error)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className={styles.commentsSection}>
            <h3 className={styles.commentsTitle}>
                <MessageCircle />
                Comments ({memory.comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className={styles.commentForm}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={styles.commentInput}
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    className={styles.commentSubmit}
                    disabled={!newComment.trim() || isSubmitting}
                >
                    <Send />
                </button>
            </form>

            {/* Comments List */}
            <div className={styles.commentsList}>
                {memory.comments.length === 0 ? (
                    <p className={styles.noComments}>
                        No comments yet. Be the first to share your thoughts!
                    </p>
                ) : (
                    memory.comments.map(comment => (
                        <div key={comment.id} className={styles.comment}>
                            <div className={styles.commentAvatar}>
                                {comment.author.avatar ? (
                                    <Image
                                        src={comment.author.avatar}
                                        alt={comment.author.name || 'User'}
                                        width={36}
                                        height={36}
                                    />
                                ) : (
                                    <User />
                                )}
                            </div>
                            <div className={styles.commentContent}>
                                <div className={styles.commentHeader}>
                                    <span className={styles.commentAuthor}>
                                        {comment.author.name || 'Unknown'}
                                    </span>
                                    <span className={styles.commentTime}>
                                        {formatTime(comment.createdAt)}
                                    </span>
                                </div>
                                <p className={styles.commentText}>{comment.content}</p>
                            </div>
                            {comment.author.id === user.id && (
                                <button
                                    className={styles.commentDelete}
                                    onClick={() => handleDelete(comment.id)}
                                    disabled={deletingId === comment.id}
                                    title="Delete comment"
                                >
                                    <Trash2 />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
