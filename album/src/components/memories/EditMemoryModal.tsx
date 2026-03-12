'use client'

import { useState } from 'react'
import { X, Calendar, MapPin, Check, Loader2 } from 'lucide-react'
import type { Memory, Tag } from '@/app/memory/[id]/MemoryDetailClient'
import styles from '@/app/memory/[id]/MemoryDetail.module.css'

interface EditMemoryModalProps {
    memory: Memory
    allTags: Tag[]
    onClose: () => void
    onSave: (updated: Partial<Memory>) => void
}

export default function EditMemoryModal({ memory, allTags, onClose, onSave }: EditMemoryModalProps) {
    const [title, setTitle] = useState(memory.title)
    const [description, setDescription] = useState(memory.description || '')
    const [location, setLocation] = useState(memory.location || '')
    const [dateTaken, setDateTaken] = useState(
        memory.dateTaken ? memory.dateTaken.split('T')[0] : ''
    )
    const [selectedTags, setSelectedTags] = useState<Set<string>>(
        new Set(memory.tags.map(t => t.id))
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev => {
            const newSet = new Set(prev)
            newSet.has(tagId) ? newSet.delete(tagId) : newSet.add(tagId)
            return newSet
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) {
            setError('Title is required')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const response = await fetch(`/api/memories/${memory.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || null,
                    location: location.trim() || null,
                    dateTaken: dateTaken || null,
                    tagIds: Array.from(selectedTags)
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to update memory')
            }

            const updatedMemory = await response.json()

            // Update local state with new data
            onSave({
                title: updatedMemory.title,
                description: updatedMemory.description,
                location: updatedMemory.location,
                dateTaken: updatedMemory.dateTaken,
                tags: updatedMemory.tags || memory.tags.filter(t => selectedTags.has(t.id))
            })

            onClose()
        } catch (err: any) {
            setError(err.message || 'Failed to update memory')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.editModal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Edit Memory</h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    {error && <div className={styles.modalError}>{error}</div>}

                    {/* Title */}
                    <div className={styles.formGroup}>
                        <label>Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give this memory a title..."
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell the story behind this memory..."
                            rows={4}
                        />
                    </div>

                    {/* Date and Location */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>
                                <Calendar className={styles.labelIcon} /> Date
                            </label>
                            <input
                                type="date"
                                value={dateTaken}
                                onChange={(e) => setDateTaken(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>
                                <MapPin className={styles.labelIcon} /> Location
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Where was this?"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    {allTags.length > 0 && (
                        <div className={styles.formGroup}>
                            <label>Tags</label>
                            <div className={styles.tagGrid}>
                                {allTags.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        className={`${styles.tagChip} ${selectedTags.has(tag.id) ? styles.tagSelected : ''}`}
                                        onClick={() => toggleTag(tag.id)}
                                        style={tag.color ? { borderColor: tag.color } : undefined}
                                    >
                                        {tag.name}
                                        {selectedTags.has(tag.id) && <Check />}
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
                            {isSubmitting ? (
                                <>
                                    <Loader2 className={styles.spinner} />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
