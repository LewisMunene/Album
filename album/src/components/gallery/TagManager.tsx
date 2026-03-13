'use client'

import { useState } from 'react'
import { Tag, Plus, X, Check, Loader2, Palette } from 'lucide-react'
import styles from './TagManager.module.css'

export interface TagOption {
    id: string
    name: string
    color: string | null
}

interface TagManagerProps {
    tags: TagOption[]
    onTagCreated?: (newTag: TagOption) => void
}

// Preset colors for tags
const TAG_COLORS = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#14b8a6', // teal
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#6b7280', // gray
    '#c4956a', // brand accent
]

export default function TagManager({ tags, onTagCreated }: TagManagerProps) {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button
                className={styles.addTagBtn}
                onClick={() => setShowModal(true)}
                title="Manage Tags"
            >
                <Plus />
                <span>Add Tag</span>
            </button>

            {showModal && (
                <TagManagerModal
                    tags={tags}
                    onClose={() => setShowModal(false)}
                    onTagCreated={(tag) => {
                        onTagCreated?.(tag)
                    }}
                />
            )}
        </>
    )
}

interface TagManagerModalProps {
    tags: TagOption[]
    onClose: () => void
    onTagCreated: (tag: TagOption) => void
}

function TagManagerModal({ tags, onClose, onTagCreated }: TagManagerModalProps) {
    const [newTagName, setNewTagName] = useState('')
    const [newTagColor, setNewTagColor] = useState<string | null>(TAG_COLORS[0])
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [localTags, setLocalTags] = useState(tags)

    const handleCreateTag = async (e: React.FormEvent) => {
        e.preventDefault()

        const trimmedName = newTagName.trim()

        if (!trimmedName) {
            setError('Please enter a tag name')
            return
        }

        // Check for duplicates
        if (localTags.some(t => t.name.toLowerCase() === trimmedName.toLowerCase())) {
            setError('A tag with this name already exists')
            return
        }

        setIsCreating(true)
        setError('')

        try {
            const response = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: trimmedName,
                    color: newTagColor
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to create tag')
            }

            const createdTag = await response.json()

            // Add to local list
            setLocalTags(prev => [...prev, createdTag])

            // Notify parent
            onTagCreated(createdTag)

            // Reset form
            setNewTagName('')
            setNewTagColor(TAG_COLORS[0])
            setSuccessMessage(`Tag "${trimmedName}" created!`)
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err: any) {
            setError(err.message || 'Failed to create tag')
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>
                        <Tag /> Manage Tags
                    </h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                <div className={styles.modalContent}>
                    {/* Create New Tag Section */}
                    <div className={styles.createSection}>
                        <h3>Create New Tag</h3>

                        <form onSubmit={handleCreateTag} className={styles.createForm}>
                            <div className={styles.inputRow}>
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => {
                                        setNewTagName(e.target.value)
                                        setError('')
                                    }}
                                    placeholder="Enter tag name..."
                                    className={styles.tagInput}
                                    maxLength={30}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className={styles.createBtn}
                                    disabled={isCreating || !newTagName.trim()}
                                >
                                    {isCreating ? (
                                        <Loader2 className={styles.spinner} />
                                    ) : (
                                        <>
                                            <Plus /> Create
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Color Picker */}
                            <div className={styles.colorSection}>
                                <label>
                                    <Palette /> Choose color:
                                </label>
                                <div className={styles.colorGrid}>
                                    {TAG_COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`${styles.colorSwatch} ${newTagColor === color ? styles.colorSwatchActive : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setNewTagColor(color)}
                                            title={color}
                                        >
                                            {newTagColor === color && <Check />}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className={`${styles.colorSwatch} ${styles.colorSwatchNone} ${newTagColor === null ? styles.colorSwatchActive : ''}`}
                                        onClick={() => setNewTagColor(null)}
                                        title="No color"
                                    >
                                        {newTagColor === null && <Check />}
                                    </button>
                                </div>
                            </div>

                            {/* Preview */}
                            {newTagName.trim() && (
                                <div className={styles.preview}>
                                    <span>Preview:</span>
                                    <span
                                        className={styles.previewTag}
                                        style={newTagColor ? { borderColor: newTagColor, color: newTagColor } : undefined}
                                    >
                                        {newTagName.trim()}
                                    </span>
                                </div>
                            )}

                            {error && <div className={styles.error}>{error}</div>}
                            {successMessage && <div className={styles.success}>{successMessage}</div>}
                        </form>
                    </div>

                    {/* Existing Tags Section */}
                    <div className={styles.existingSection}>
                        <h3>Existing Tags ({localTags.length})</h3>

                        {localTags.length === 0 ? (
                            <p className={styles.noTags}>No tags created yet. Create your first tag above!</p>
                        ) : (
                            <div className={styles.tagsList}>
                                {localTags.map(tag => (
                                    <div
                                        key={tag.id}
                                        className={styles.tagItem}
                                        style={tag.color ? { borderLeftColor: tag.color } : undefined}
                                    >
                                        <span
                                            className={styles.tagDot}
                                            style={tag.color ? { backgroundColor: tag.color } : undefined}
                                        />
                                        <span className={styles.tagName}>{tag.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.doneBtn} onClick={onClose}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
