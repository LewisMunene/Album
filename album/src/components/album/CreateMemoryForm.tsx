'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
    X, Upload, Camera, Video, FileText, MapPin, Calendar, Tag, Users,
    FolderOpen, Check, Loader2, Plus, Image as ImageIcon, AlertCircle
} from 'lucide-react'
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

interface FileWithPreview {
    id: string
    file: File
    preview: string
    type: 'image' | 'video'
    error?: string
}

interface CreateMemoryFormProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    defaultAlbumId?: string
}

// Constants
const MAX_IMAGES = 10
const MAX_VIDEOS = 3
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const VALID_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

export default function CreateMemoryForm({ isOpen, onClose, onSuccess, defaultAlbumId }: CreateMemoryFormProps) {
    // Form state
    const [type, setType] = useState<'PHOTO' | 'VIDEO' | 'STORY'>('PHOTO')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [dateTaken, setDateTaken] = useState('')
    const [selectedPeople, setSelectedPeople] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedAlbums, setSelectedAlbums] = useState<string[]>(defaultAlbumId ? [defaultAlbumId] : [])

    // Multi-file state
    const [files, setFiles] = useState<FileWithPreview[]>([])
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
    const [uploadProgress, setUploadProgress] = useState(0)
    const [currentUpload, setCurrentUpload] = useState(0)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Count files by type
    const imageCount = files.filter(f => f.type === 'image').length
    const videoCount = files.filter(f => f.type === 'video').length

    // Reset album when modal opens with defaultAlbumId
    useEffect(() => {
        if (isOpen && defaultAlbumId) {
            setSelectedAlbums([defaultAlbumId])
        }
    }, [isOpen, defaultAlbumId])

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
                fetch('/api/albums/list'),
            ])

            if (familyRes.ok) {
                const data = await familyRes.json()
                // Handle both array and wrapped responses
                setFamilyMembers(Array.isArray(data) ? data : (data.familyMembers || []))
            }
            if (tagsRes.ok) {
                const data = await tagsRes.json()
                setTags(Array.isArray(data) ? data : (data.tags || []))
            }
            if (albumsRes.ok) {
                const data = await albumsRes.json()
                setAlbums(Array.isArray(data) ? data : (data.albums || []))
            }
        } catch (err) {
            console.error('Failed to fetch data:', err)
        } finally {
            setIsLoading(false)
        }
    }

    // Generate unique ID for files
    const generateId = () => Math.random().toString(36).substring(2, 9)

    // File handling - now supports multiple files
    const handleFilesSelect = useCallback((selectedFiles: FileList | File[]) => {
        const filesArray = Array.from(selectedFiles)
        const newFiles: FileWithPreview[] = []
        const errors: string[] = []

        for (const file of filesArray) {
            const isImage = VALID_IMAGE_TYPES.includes(file.type)
            const isVideo = VALID_VIDEO_TYPES.includes(file.type)

            // Validate file type
            if (!isImage && !isVideo) {
                errors.push(`${file.name}: Invalid file type`)
                continue
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name}: File too large (max 50MB)`)
                continue
            }

            // Check limits
            const currentImages = files.filter(f => f.type === 'image').length + newFiles.filter(f => f.type === 'image').length
            const currentVideos = files.filter(f => f.type === 'video').length + newFiles.filter(f => f.type === 'video').length

            if (isImage && currentImages >= MAX_IMAGES) {
                errors.push(`Maximum ${MAX_IMAGES} images allowed`)
                continue
            }

            if (isVideo && currentVideos >= MAX_VIDEOS) {
                errors.push(`Maximum ${MAX_VIDEOS} videos allowed`)
                continue
            }

            // Create preview
            const fileWithPreview: FileWithPreview = {
                id: generateId(),
                file,
                preview: URL.createObjectURL(file),
                type: isImage ? 'image' : 'video'
            }

            newFiles.push(fileWithPreview)
        }

        if (errors.length > 0) {
            setError(errors.join('. '))
        } else {
            setError(null)
        }

        if (newFiles.length > 0) {
            setFiles(prev => [...prev, ...newFiles])

            // Auto-detect type based on majority
            const totalImages = files.filter(f => f.type === 'image').length + newFiles.filter(f => f.type === 'image').length
            const totalVideos = files.filter(f => f.type === 'video').length + newFiles.filter(f => f.type === 'video').length

            if (totalVideos > totalImages) {
                setType('VIDEO')
            } else {
                setType('PHOTO')
            }
        }
    }, [files])

    const removeFile = useCallback((id: string) => {
        setFiles(prev => {
            const file = prev.find(f => f.id === id)
            if (file) {
                URL.revokeObjectURL(file.preview)
            }
            return prev.filter(f => f.id !== id)
        })
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleFilesSelect(e.dataTransfer.files)
    }, [handleFilesSelect])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    // Toggle selections
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

    const toggleAlbum = (id: string) => {
        setSelectedAlbums(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }

    // Form submission - batch upload
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate
        if (type !== 'STORY' && files.length === 0) {
            setError('Please select at least one file to upload')
            return
        }

        if (files.length === 1 && !title.trim()) {
            setError('Please enter a title')
            return
        }

        setIsSubmitting(true)
        setError(null)
        setUploadProgress(0)
        setCurrentUpload(0)

        try {
            const totalFiles = files.length || 1 // At least 1 for STORY type
            let uploadedCount = 0
            const errors: string[] = []

            // If it's a story with no files
            if (type === 'STORY' && files.length === 0) {
                const formData = new FormData()
                formData.append('title', title.trim())
                formData.append('type', 'STORY')
                if (description) formData.append('description', description)
                if (location) formData.append('location', location)
                if (dateTaken) formData.append('dateTaken', dateTaken)
                if (selectedPeople.length > 0) {
                    formData.append('peopleIds', JSON.stringify(selectedPeople))
                }
                if (selectedTags.length > 0) {
                    formData.append('tagIds', JSON.stringify(selectedTags))
                }
                if (selectedAlbums.length > 0) {
                    formData.append('albumIds', JSON.stringify(selectedAlbums))
                }

                const response = await fetch('/api/memories', {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    const data = await response.json()
                    throw new Error(data.error || 'Failed to create story')
                }
            } else {
                // Upload each file
                for (const fileItem of files) {
                    setCurrentUpload(uploadedCount + 1)

                    const formData = new FormData()

                    // Use individual title or filename
                    const memoryTitle = files.length === 1
                        ? title.trim()
                        : (title.trim() || fileItem.file.name.replace(/\.[^/.]+$/, ''))

                    formData.append('title', memoryTitle)
                    formData.append('type', fileItem.type === 'video' ? 'VIDEO' : 'PHOTO')
                    formData.append('file', fileItem.file)

                    // Shared metadata for all files
                    if (description) formData.append('description', description)
                    if (location) formData.append('location', location)
                    if (dateTaken) formData.append('dateTaken', dateTaken)
                    if (selectedPeople.length > 0) {
                        formData.append('peopleIds', JSON.stringify(selectedPeople))
                    }
                    if (selectedTags.length > 0) {
                        formData.append('tagIds', JSON.stringify(selectedTags))
                    }
                    if (selectedAlbums.length > 0) {
                        formData.append('albumIds', JSON.stringify(selectedAlbums))
                    }

                    try {
                        const response = await fetch('/api/memories', {
                            method: 'POST',
                            body: formData,
                        })

                        if (!response.ok) {
                            const data = await response.json()
                            errors.push(`${fileItem.file.name}: ${data.error || 'Upload failed'}`)
                        } else {
                            uploadedCount++
                        }
                    } catch (err) {
                        errors.push(`${fileItem.file.name}: Network error`)
                    }

                    setUploadProgress(Math.round((uploadedCount / totalFiles) * 100))
                }
            }

            if (errors.length > 0 && uploadedCount === 0) {
                throw new Error(errors.join('. '))
            }

            if (errors.length > 0) {
                setError(`${uploadedCount} uploaded, ${errors.length} failed: ${errors[0]}`)
            }

            setSuccess(true)
            setTimeout(() => {
                resetForm()
                onSuccess()
                onClose()
            }, 1500)
        } catch (err: any) {
            setError(err.message || 'Failed to create memories')
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        // Cleanup previews
        files.forEach(f => URL.revokeObjectURL(f.preview))

        setType('PHOTO')
        setTitle('')
        setDescription('')
        setLocation('')
        setDateTaken('')
        setSelectedPeople([])
        setSelectedTags([])
        setSelectedAlbums(defaultAlbumId ? [defaultAlbumId] : [])
        setFiles([])
        setError(null)
        setSuccess(false)
        setUploadProgress(0)
        setCurrentUpload(0)
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2>Add New Memories</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* Success State */}
                {success ? (
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>
                            <Check />
                        </div>
                        <h3>Memories Added!</h3>
                        <p>{files.length > 1 ? `${files.length} memories` : 'Memory'} saved successfully</p>
                    </div>
                ) : isLoading ? (
                    <div className={styles.loadingState}>
                        <Loader2 className={styles.spinner} />
                        <p>Loading...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Type Selector */}
                        <div className={styles.typeSelector}>
                            <button
                                type="button"
                                className={`${styles.typeBtn} ${type === 'PHOTO' ? styles.typeBtnActive : ''}`}
                                onClick={() => setType('PHOTO')}
                            >
                                <Camera /> Photos
                            </button>
                            <button
                                type="button"
                                className={`${styles.typeBtn} ${type === 'VIDEO' ? styles.typeBtnActive : ''}`}
                                onClick={() => setType('VIDEO')}
                            >
                                <Video /> Videos
                            </button>
                            <button
                                type="button"
                                className={`${styles.typeBtn} ${type === 'STORY' ? styles.typeBtnActive : ''}`}
                                onClick={() => setType('STORY')}
                            >
                                <FileText /> Story
                            </button>
                        </div>

                        {/* Multi-File Drop Zone */}
                        {type !== 'STORY' && (
                            <div className={styles.uploadSection}>
                                {/* File Count Info */}
                                <div className={styles.uploadInfo}>
                                    <span>
                                        <ImageIcon /> {imageCount}/{MAX_IMAGES} images
                                    </span>
                                    <span>
                                        <Video /> {videoCount}/{MAX_VIDEOS} videos
                                    </span>
                                </div>

                                {/* Drop Zone */}
                                <div
                                    className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''}`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload />
                                    <p>Drag and drop or click to upload</p>
                                    <span>Select multiple files at once • JPEG, PNG, GIF, WebP, MP4 (max 50MB each)</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={(e) => e.target.files && handleFilesSelect(e.target.files)}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {/* Preview Grid */}
                                {files.length > 0 && (
                                    <div className={styles.previewGrid}>
                                        {files.map((fileItem) => (
                                            <div key={fileItem.id} className={styles.previewCard}>
                                                {fileItem.type === 'video' ? (
                                                    <video
                                                        src={fileItem.preview}
                                                        className={styles.previewMedia}
                                                    />
                                                ) : (
                                                    <img
                                                        src={fileItem.preview}
                                                        alt="Preview"
                                                        className={styles.previewMedia}
                                                    />
                                                )}
                                                <div className={styles.previewType}>
                                                    {fileItem.type === 'video' ? <Video /> : <ImageIcon />}
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.removeFile}
                                                    onClick={() => removeFile(fileItem.id)}
                                                >
                                                    <X />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Add More Button */}
                                        {(imageCount < MAX_IMAGES || videoCount < MAX_VIDEOS) && (
                                            <button
                                                type="button"
                                                className={styles.addMoreBtn}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Plus />
                                                <span>Add More</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Title */}
                        <div className={styles.field}>
                            <label>
                                Title {files.length <= 1 && '*'}
                                {files.length > 1 && (
                                    <span className={styles.labelHint}>
                                        (leave blank to use filenames)
                                    </span>
                                )}
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={
                                    files.length > 1
                                        ? "Shared title for all memories (or leave blank)"
                                        : "Give this memory a title..."
                                }
                                required={files.length <= 1 && type !== 'STORY'}
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

                        {/* Albums - Now Multi-select */}
                        {albums.length > 0 && (
                            <div className={styles.field}>
                                <label>
                                    <FolderOpen /> Add to Albums
                                </label>
                                <div className={styles.chips}>
                                    {albums.map((album) => (
                                        <button
                                            key={album.id}
                                            type="button"
                                            className={`${styles.chip} ${selectedAlbums.includes(album.id) ? styles.chipSelected : ''}`}
                                            onClick={() => toggleAlbum(album.id)}
                                        >
                                            <FolderOpen />
                                            {album.name}
                                            {selectedAlbums.includes(album.id) && <Check />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Progress */}
                        {isSubmitting && files.length > 1 && (
                            <div className={styles.progressSection}>
                                <div className={styles.progressInfo}>
                                    <span>Uploading {currentUpload} of {files.length}...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className={styles.error}>
                                <AlertCircle />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={onClose}
                                disabled={isSubmitting}
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
                                        {files.length > 1 ? `Uploading (${uploadProgress}%)` : 'Saving...'}
                                    </>
                                ) : (
                                    <>
                                        <Check />
                                        {files.length > 1
                                            ? `Save ${files.length} Memories`
                                            : 'Save Memory'
                                        }
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