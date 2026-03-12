'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, FileText, Image as ImageIcon, Maximize2 } from 'lucide-react'
import type { Memory } from '@/app/memory/[id]/MemoryDetailClient'
import styles from '@/app/memory/[id]/MemoryDetail.module.css'

interface MemoryImageProps {
    memory: Memory
}

export default function MemoryImage({ memory }: MemoryImageProps) {
    const [imageError, setImageError] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const renderMedia = () => {
        if (memory.type === 'STORY') {
            return (
                <div className={styles.storyPlaceholder}>
                    <FileText />
                    <span>Story</span>
                </div>
            )
        }

        if (memory.type === 'VIDEO') {
            return (
                <video
                    src={memory.fileUrl}
                    controls
                    className={styles.video}
                    poster={memory.thumbnailUrl || undefined}
                >
                    Your browser does not support the video tag.
                </video>
            )
        }

        // PHOTO type
        if (imageError) {
            return (
                <div className={styles.imagePlaceholder}>
                    <ImageIcon />
                    <span>Image unavailable</span>
                </div>
            )
        }

        return (
            <>
                <Image
                    src={memory.fileUrl}
                    alt={memory.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    onError={() => setImageError(true)}
                    priority
                />
                <button
                    className={styles.fullscreenBtn}
                    onClick={() => setIsFullscreen(true)}
                    title="View fullscreen"
                >
                    <Maximize2 />
                </button>
            </>
        )
    }

    return (
        <>
            <div className={styles.mediaContainer}>
                {renderMedia()}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && memory.type === 'PHOTO' && (
                <div
                    className={styles.fullscreenOverlay}
                    onClick={() => setIsFullscreen(false)}
                >
                    <Image
                        src={memory.fileUrl}
                        alt={memory.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>
            )}
        </>
    )
}
