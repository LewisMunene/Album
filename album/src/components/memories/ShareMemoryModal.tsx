'use client'

import { useState } from 'react'
import { X, Copy, Check, Link as LinkIcon, Facebook, Twitter, Mail } from 'lucide-react'
import type { Memory } from '@/app/memory/[id]/MemoryDetailClient'
import styles from '@/app/memory/[id]/MemoryDetail.module.css'

interface ShareMemoryModalProps {
    memory: Memory
    onClose: () => void
}

export default function ShareMemoryModal({ memory, onClose }: ShareMemoryModalProps) {
    const [copied, setCopied] = useState(false)

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/memory/${memory.id}`
        : ''

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const shareToFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=400'
        )
    }

    const shareToTwitter = () => {
        const text = `Check out this memory: ${memory.title}`
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=400'
        )
    }

    const shareByEmail = () => {
        const subject = `Check out this memory: ${memory.title}`
        const body = `I wanted to share this memory with you:\n\n${memory.title}\n${memory.description || ''}\n\nView it here: ${shareUrl}`
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.shareModal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Share Memory</h2>
                    <button onClick={onClose} className={styles.modalClose}>
                        <X />
                    </button>
                </div>

                <div className={styles.shareContent}>
                    <p className={styles.shareTitle}>"{memory.title}"</p>

                    {/* Copy Link */}
                    <div className={styles.copyLinkSection}>
                        <div className={styles.linkDisplay}>
                            <LinkIcon />
                            <span>{shareUrl}</span>
                        </div>
                        <button onClick={copyLink} className={styles.copyBtn}>
                            {copied ? <Check /> : <Copy />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    {/* Social Share */}
                    <div className={styles.socialShare}>
                        <p>Share via:</p>
                        <div className={styles.socialButtons}>
                            <button
                                onClick={shareToFacebook}
                                className={styles.socialBtn}
                                title="Share on Facebook"
                            >
                                <Facebook />
                            </button>
                            <button
                                onClick={shareToTwitter}
                                className={styles.socialBtn}
                                title="Share on Twitter"
                            >
                                <Twitter />
                            </button>
                            <button
                                onClick={shareByEmail}
                                className={styles.socialBtn}
                                title="Share via Email"
                            >
                                <Mail />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
