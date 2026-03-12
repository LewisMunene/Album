'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import type { Memory } from '@/app/memory/[id]/MemoryDetailClient'
import styles from '@/app/memory/[id]/MemoryDetail.module.css'

interface DeleteMemoryModalProps {
    memory: Memory
    onClose: () => void
}

export default function DeleteMemoryModal({ memory, onClose }: DeleteMemoryModalProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState('')

    const handleDelete = async () => {
        setIsDeleting(true)
        setError('')

        try {
            const response = await fetch(`/api/memories/${memory.id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete memory')
            }

            // Redirect to dashboard or gallery
            router.push('/album')
        } catch (err: any) {
            setError(err.message || 'Failed to delete memory')
            setIsDeleting(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.deleteModal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Delete Memory</h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                <div className={styles.deleteContent}>
                    <div className={styles.deleteWarning}>
                        <AlertTriangle />
                    </div>
                    
                    <h3>Are you sure?</h3>
                    
                    <p>
                        You are about to delete <strong>"{memory.title}"</strong>. 
                        This action cannot be undone.
                    </p>

                    <div className={styles.deleteDetails}>
                        <p>This will permanently remove:</p>
                        <ul>
                            <li>The memory and its file</li>
                            <li>All {memory.comments.length} comment{memory.comments.length !== 1 ? 's' : ''}</li>
                            <li>All album associations</li>
                        </ul>
                    </div>

                    {error && <div className={styles.modalError}>{error}</div>}

                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.btnSecondary}>
                            Cancel
                        </button>
                        <button 
                            onClick={handleDelete} 
                            disabled={isDeleting} 
                            className={styles.btnDanger}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Memory'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
