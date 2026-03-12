'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Heart,
    Share2,
    MoreHorizontal,
    Edit,
    Trash2
} from 'lucide-react'
import MemoryImage from '@/components/memories/MemoryImage'
import MemoryInfo from '@/components/memories/MemoryInfo'
import MemoryComments from '@/components/memories/MemoryComments'
import EditMemoryModal from '@/components/memories/EditMemoryModal'
import DeleteMemoryModal from '@/components/memories/DeleteMemoryModal'
import ShareMemoryModal from '@/components/memories/ShareMemoryModal'
import styles from './MemoryDetail.module.css'

export interface Memory {
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
    comments: Array<{
        id: string
        content: string
        createdAt: string
        author: { id: string; name: string | null; avatar: string | null }
    }>
}

export interface Tag {
    id: string
    name: string
    color: string | null
}

interface MemoryDetailClientProps {
    memory: Memory
    user: { id: string; name?: string | null }
    allTags: Tag[]
}

export default function MemoryDetailClient({ memory: initialMemory, user, allTags }: MemoryDetailClientProps) {
    const router = useRouter()
    const [memory, setMemory] = useState(initialMemory)
    const [showMenu, setShowMenu] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [isLiked, setIsLiked] = useState(false)

    const isOwner = user.id === memory.uploadedBy.id

    const handleMemoryUpdate = (updatedData: Partial<Memory>) => {
        setMemory(prev => ({ ...prev, ...updatedData }))
    }

    const handleCommentAdded = (newComment: Memory['comments'][0]) => {
        setMemory(prev => ({
            ...prev,
            comments: [newComment, ...prev.comments]
        }))
    }

    const handleCommentDeleted = (commentId: string) => {
        setMemory(prev => ({
            ...prev,
            comments: prev.comments.filter(c => c.id !== commentId)
        }))
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <button 
                    onClick={() => router.back()} 
                    className={styles.backBtn}
                >
                    <ArrowLeft />
                    <span>Back</span>
                </button>

                <div className={styles.headerActions}>
                    <button 
                        className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
                        onClick={() => setIsLiked(!isLiked)}
                        title="Like"
                    >
                        <Heart fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                    
                    <button 
                        className={styles.actionBtn}
                        onClick={() => setShowShareModal(true)}
                        title="Share"
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
                                        className={styles.menuBackdrop}
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
                                            <Edit /> Edit
                                        </button>
                                        <button 
                                            className={`${styles.menuItem} ${styles.menuItemDanger}`}
                                            onClick={() => {
                                                setShowMenu(false)
                                                setShowDeleteModal(true)
                                            }}
                                        >
                                            <Trash2 /> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.content}>
                    {/* Left: Media */}
                    <div className={styles.mediaSection}>
                        <MemoryImage memory={memory} />
                    </div>

                    {/* Right: Info & Comments */}
                    <div className={styles.infoSection}>
                        <MemoryInfo memory={memory} />
                        <MemoryComments 
                            memory={memory}
                            user={user}
                            onCommentAdded={handleCommentAdded}
                            onCommentDeleted={handleCommentDeleted}
                        />
                    </div>
                </div>
            </main>

            {/* Modals */}
            {showEditModal && (
                <EditMemoryModal 
                    memory={memory}
                    allTags={allTags}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleMemoryUpdate}
                />
            )}

            {showDeleteModal && (
                <DeleteMemoryModal 
                    memory={memory}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}

            {showShareModal && (
                <ShareMemoryModal 
                    memory={memory}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    )
}
