'use client'

import Link from 'next/link'
import styles from './Stats.module.css'

interface StatsData {
    memories: number
    albums: number
    familyMembers: number
    comments: number
}

interface StatsProps {
    data: StatsData
}

export default function Stats({ data }: StatsProps) {
    const stats = [
        {
            number: data.memories,
            label: 'Memories',
            emoji: '📷',
            href: '/gallery',
            description: 'View all photos'
        },
        {
            number: data.albums,
            label: 'Albums',
            emoji: '📁',
            href: '/albums',
            description: 'Browse collections'
        },
        {
            number: data.familyMembers,
            label: 'Family Members',
            emoji: '👨‍👩‍👧‍👦',
            href: '/family',
            description: 'View family tree'
        },
        {
            number: data.comments,
            label: 'Comments',
            emoji: '💬',
            href: '/album',
            description: 'View activity'
        },
    ]

    return (
        <section className={styles.statsSection}>
            <div className={styles.statsContainer}>
                <div className={styles.statsGrid}>
                    {stats.map((stat, i) => (
                        <Link
                            key={i}
                            href={stat.href}
                            className={styles.statCard}
                        >
                            <div className={styles.statEmoji}>{stat.emoji}</div>
                            <p className={styles.statNumber}>{stat.number}</p>
                            <p className={styles.statLabel}>{stat.label}</p>
                            <span className={styles.statHint}>{stat.description}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}