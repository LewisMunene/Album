'use client'

import Link from 'next/link'
import { Calendar, MapPin, User, Eye, FolderOpen, Tag } from 'lucide-react'
import type { Memory } from '@/app/memory/[id]/MemoryDetailClient'
import styles from '@/app/memory/[id]/MemoryDetail.module.css'

interface MemoryInfoProps {
    memory: Memory
}

export default function MemoryInfo({ memory }: MemoryInfoProps) {
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(dateString))
    }

    return (
        <div className={styles.infoContainer}>
            {/* Title */}
            <h1 className={styles.title}>{memory.title}</h1>

            {/* Description */}
            {memory.description && (
                <p className={styles.description}>{memory.description}</p>
            )}

            {/* Metadata Card */}
            <div className={styles.metaCard}>
                <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                        <Calendar className={styles.metaIcon} />
                        <div>
                            <span className={styles.metaLabel}>Date</span>
                            <span className={styles.metaValue}>
                                {memory.dateTaken
                                    ? formatDate(memory.dateTaken)
                                    : formatDate(memory.createdAt)
                                }
                            </span>
                        </div>
                    </div>

                    {memory.location && (
                        <div className={styles.metaItem}>
                            <MapPin className={styles.metaIcon} />
                            <div>
                                <span className={styles.metaLabel}>Location</span>
                                <span className={styles.metaValue}>{memory.location}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                        <User className={styles.metaIcon} />
                        <div>
                            <span className={styles.metaLabel}>Uploaded by</span>
                            <span className={styles.metaValue}>
                                {memory.uploadedBy.name || 'Unknown'}
                            </span>
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        <Eye className={styles.metaIcon} />
                        <div>
                            <span className={styles.metaLabel}>Views</span>
                            <span className={styles.metaValue}>{memory.viewCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tags */}
            {memory.tags.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <Tag /> Tags
                    </h3>
                    <div className={styles.tagsList}>
                        {memory.tags.map(tag => (
                            <span
                                key={tag.id}
                                className={styles.tag}
                                style={tag.color ? { borderColor: tag.color } : undefined}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* People Tagged */}
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
                                {person.name}
                            </Link>
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
                    <div className={styles.albumsList}>
                        {memory.albums.map(album => (
                            <Link
                                key={album.id}
                                href={`/albums/${album.id}`}
                                className={styles.albumChip}
                            >
                                <FolderOpen />
                                {album.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
