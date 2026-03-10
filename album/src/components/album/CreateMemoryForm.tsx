'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { X, Upload, Camera, Video, FileText, MapPin, Calendar, Tag, Users, FolderOpen, Check, Loader2 } from 'lucide-react'
import styles from './CreateMemoryForm.module.css'

interface FamilyMember {
    id: string
    firstName: string
    lastName: string
    profilePhoto: string | null
}

interface TagOption {
    id: string
    name: string
    color: string | null
}

interface Album {
    id: string
    name: string
}

interface CreateMemoryFormProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function CreateMemoryForm({ isOpen, onClose, onSuccess }: CreateMemoryFormProps) {
    // Form state
    const [type, setType] = useState<'PHOTO' | 'VIDEO' | 'STORY'>('PHOTO')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [dateTaken, setDateTaken] = useState('')
    const [selectedPeople, setSelectedPeople] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedAlbum, setSelectedAlbum] = useState('')

    // File state
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    // Data state
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
    const [tags, setTags] = useState<TagOption[]>([])
    const [albums, setAlbums] = useState<Album[]>([])

    // UI state
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Fetch data when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchData()
        }
    }, [isOpen])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [familyRes, tagsRes, albumsRes] = await Promise.all([
                fetch('/api/family-members'),
                fetch('/api/tags'),
                fetch('/api/albums'),
            ])

            if (familyRes.ok) {
                const data = await familyRes.json()
                setFamilyMembers(data.familyMembers || [])
            }
            if (tagsRes.ok) {
                const data = await tagsRes.json()
                setTags(data.tags || [])
            }
            if (albumsRes.ok) {
                const data = await albumsRes.json()
                setAlbums(data.albums || [])
            }
        } catch (err) {
            console.error('Failed to fetch data:', err)
        } finally {
            setIsLoading(false)
        }
    }

    // File handling
    const handleFileSelect = useCallback((selectedFile: File) => {
        if (!selectedFile) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
        if (!validTypes.includes(selectedFile.type)) {
            setError('Please select a valid image or video file')
            return
        }

        // Validate file size (max 50MB)
        if (selectedFile.size > 50 * 1024 * 1024) {
            setError('File size must be less than 50MB')
            return
        }

        setFile(selectedFile)
        setError(null)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)

        // Auto-detect type
        if (selectedFile.type.startsWith('video/')) {
            setType('VIDEO')
        } else {
            setType('PHOTO')
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            handleFileSelect(droppedFile)
        }
    }, [handleFileSelect])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) {
            setError('Please enter a title')
            return
        }

        if (type !== 'STORY' && !file) {
            setError('Please select a file to upload')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('type', type)
            if (description) formData.append('description', description)
            if (location) formData.append('location', location)
            if (dateTaken) formData.append('dateTaken', dateTaken)
            if (file) formData.append('file', file)
            if (selectedAlbum) formData.append('albumId', selectedAlbum)
            if (selectedPeople.length > 0) {
                formData.append('peopleIds', JSON.stringify(selectedPeople))
            }
            if (selectedTags.length > 0) {
                formData.append('tagIds', JSON.stringify(selectedTags))
            }

            const response = await fetch('/api/memories', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to create memory')
            }

            setSuccess(true)
            setTimeout(() => {
                resetForm()
                onSuccess()
                onClose()
            }, 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create memory')
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setType('PHOTO')
        setTitle('')
        setDescription('')
        setLocation('')
        setDateTaken('')
        setSelectedPeople([])
        setSelectedTags([])
        setSelectedAlbum('')
        setFile(null)
        setPreview(null)
        setError(null)
        setSuccess(false)
    }

    const togglePerson = (id: string) => {
        setSelectedPeople(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    const toggleTag = (id: string) => {
        setSelectedTags(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2>Add New Memory</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X />
                    </button>
                </div>

                {success ? (
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>
                            <Check />
                        </div>
                        <h3>Memory Added!</h3>
                        <p>Your memory has been saved to the family album.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Type Selector */}
                        <div className={styles.typeSelector}>
                            {[
                                { value: 'PHOTO', icon: Camera, label: 'Photo' },
                                { value: 'VIDEO', icon: Video, label: 'Video' },
                                { value: 'STORY', icon: FileText, label: 'Story' },
                            ].map(({ value, icon: Icon, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`${styles.typeBtn} ${type === value ? styles.typeBtnActive : ''}`}
                                    onClick={() => setType(value as typeof type)}
                                >
                                    <Icon />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* File Upload (for Photo/Video) */}
                        {type !== 'STORY' && (
                            <div
                                className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''} ${preview ? styles.dropZoneHasFile : ''}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {preview ? (
                                    <div className={styles.preview}>
                                        {type === 'VIDEO' ? (
                                            <video src={preview} className={styles.previewMedia} />
                                        ) : (
                                            <img src={preview} alt="Preview" className={styles.previewMedia} />
                                        )}
                                        <button
                                            type="button"
                                            className={styles.removeFile}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setFile(null)
                                                setPreview(null)
                                            }}
                                        >
                                            <X />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.dropZoneContent}>
                                        <Upload />
                                        <p>Drag and drop or click to upload</p>
                                        <span>JPEG, PNG, GIF, WebP, MP4 (max 50MB)</span>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        )}

                        {/* Title */}
                        <div className={styles.field}>
                            <label>Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Give this memory a title..."
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className={styles.field}>
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell the story behind this memory..."
                                rows={type === 'STORY' ? 6 : 3}
                            />
                        </div>

                        {/* Date and Location Row */}
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>
                                    <Calendar /> Date
                                </label>
                                <input
                                    type="date"
                                    value={dateTaken}
                                    onChange={(e) => setDateTaken(e.target.value)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>
                                    <MapPin /> Location
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Where was this?"
                                />
                            </div>
                        </div>

                        {/* Tag Family Members */}
                        {familyMembers.length > 0 && (
                            <div className={styles.field}>
                                <label>
                                    <Users /> Tag Family Members
                                </label>
                                <div className={styles.chips}>
                                    {familyMembers.map((member) => (
                                        <button
                                            key={member.id}
                                            type="button"
                                            className={`${styles.chip} ${selectedPeople.includes(member.id) ? styles.chipSelected : ''}`}
                                            onClick={() => togglePerson(member.id)}
                                        >
                                            {member.firstName} {member.lastName}
                                            {selectedPeople.includes(member.id) && <Check />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className={styles.field}>
                                <label>
                                    <Tag /> Tags
                                </label>
                                <div className={styles.chips}>
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            className={`${styles.chip} ${selectedTags.includes(tag.id) ? styles.chipSelected : ''}`}
                                            onClick={() => toggleTag(tag.id)}
                                            style={tag.color ? { borderColor: tag.color } : undefined}
                                        >
                                            {tag.name}
                                            {selectedTags.includes(tag.id) && <Check />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Album */}
                        {albums.length > 0 && (
                            <div className={styles.field}>
                                <label>
                                    <FolderOpen /> Add to Album
                                </label>
                                <select
                                    value={selectedAlbum}
                                    onChange={(e) => setSelectedAlbum(e.target.value)}
                                >
                                    <option value="">Select an album (optional)</option>
                                    {albums.map((album) => (
                                        <option key={album.id} value={album.id}>
                                            {album.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className={styles.spinner} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check />
                                        Save Memory
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}