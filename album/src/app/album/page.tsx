// src/app/album/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Heart, Sun, Moon, Menu, Plus, Sparkles, Search, ArrowRight,
    Bell, ChevronRight, Clock, MapPin, Camera, Users
} from 'lucide-react'
import styles from './AlbumPage.module.css'

// Mock data
const onThisDayMemories = [
    { year: '2023', title: 'First Day of School', emoji: '📚' },
    { year: '2022', title: 'Family Reunion', emoji: '👨‍👩‍👧‍👦' },
    { year: '2020', title: 'Lockdown Baking', emoji: '🍪' },
    { year: '2019', title: 'Beach Vacation', emoji: '🏖️' },
]

const recentMemories = [
    { id: 1, title: 'Christmas Morning', date: 'Dec 25, 2024', location: 'Home', emoji: '🎄', rotation: -3 },
    { id: 2, title: 'Beach Getaway', date: 'Dec 20, 2024', location: 'Mombasa', emoji: '🏖️', rotation: 4 },
    { id: 3, title: 'Birthday Party', date: 'Nov 15, 2024', location: 'Nairobi', emoji: '🎂', rotation: -2 },
    { id: 4, title: 'Sunday Brunch', date: 'Nov 10, 2024', location: "Grandma's", emoji: '🍳', rotation: 3 },
    { id: 5, title: 'Road Trip', date: 'Oct 28, 2024', location: 'Nakuru', emoji: '🚗', rotation: -4 },
    { id: 6, title: 'Garden Party', date: 'Oct 15, 2024', location: 'Home', emoji: '🌻', rotation: 2 },
]

const stats = [
    { number: '3', label: 'Generations', emoji: '👨‍👩‍👧‍👦' },
    { number: '247', label: 'Memories', emoji: '📸' },
    { number: '12', label: 'Albums', emoji: '📁' },
    { number: '8', label: 'Family Members', emoji: '❤️' },
]

export default function AlbumPage() {
    const [isDark, setIsDark] = useState(false)
    const [activeFilter, setActiveFilter] = useState('All')

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDark])

    return (
        <div className={styles.page}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={styles.navInner}>
                    {/* Logo */}
                    <Link href="/album" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Heart />
                        </div>
                        <div>
                            <span className={styles.logoText}>
                                Muthee
                                <span className={styles.logoTextMuted}>Family</span>
                            </span>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <div className={styles.navLinks}>
                        {['Memories', 'Albums', 'Timeline', 'Family'].map((item, i) => (
                            <Link
                                key={item}
                                href="#"
                                className={`${styles.navLink} ${i === 0 ? styles.navLinkActive : ''}`}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className={styles.navActions}>
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={styles.themeToggle}
                        >
                            {isDark ? <Sun /> : <Moon />}
                        </button>

                        <Link href="/upload" className={styles.addButton}>
                            <Plus />
                            <span>Add Memory</span>
                        </Link>

                        <button className={styles.mobileMenuBtn}>
                            <Menu />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroGrid}>
                    {/* Left Content */}
                    <div className={styles.heroContent}>
                        <div className={styles.heroLabel}>
                            <Sparkles />
                            Welcome back
                        </div>

                        <h1 className={styles.heroTitle}>
                            Every moment<br />
                            <span className={styles.heroTitleAccent}>tells a story</span>
                        </h1>

                        <p className={styles.heroDescription}>
                            Your family's memories, beautifully preserved. Browse through
                            generations of love, laughter, and legacy.
                        </p>

                        {/* Search Bar */}
                        <div className={styles.searchBar}>
                            <div className={styles.searchInputWrapper}>
                                <Search />
                                <input type="text" placeholder="Search memories..." />
                            </div>
                            <button className={styles.searchButton}>Search</button>
                        </div>

                        {/* Links */}
                        <div className={styles.heroLinks}>
                            <Link href="/gallery" className={`${styles.heroLink} ${styles.heroLinkPrimary}`}>
                                Browse Gallery
                                <ArrowRight />
                            </Link>
                            <Link href="/upload" className={`${styles.heroLink} ${styles.heroLinkSecondary}`}>
                                Upload Photos
                            </Link>
                        </div>
                    </div>

                    {/* Right - Polaroids */}
                    <div className={styles.heroPolaroids}>
                        <div className={`${styles.polaroid} ${styles.polaroid1}`}>
                            <div
                                className={styles.polaroidImage}
                                style={{ background: 'linear-gradient(145deg, #c8ddc8, #a8c8a8)' }}
                            >
                                <span>📸</span>
                            </div>
                            <span className={styles.polaroidCaption}>Summer 2024</span>
                        </div>

                        <div className={`${styles.polaroid} ${styles.polaroid2}`}>
                            <div
                                className={styles.polaroidImage}
                                style={{ background: 'linear-gradient(145deg, #f0e0d0, #e0cfc0)' }}
                            >
                                <span>🎉</span>
                            </div>
                            <span className={styles.polaroidCaption}>Celebrations</span>
                        </div>

                        <div className={`${styles.polaroid} ${styles.polaroid3}`}>
                            <div
                                className={styles.polaroidImage}
                                style={{ background: 'linear-gradient(145deg, #d8e8f0, #c0d8e8)' }}
                            >
                                <span>❤️</span>
                            </div>
                            <span className={styles.polaroidCaption}>Together</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* On This Day Section */}
            <section className={styles.onThisDay}>
                <div className={styles.onThisDayInner}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                            <div className={styles.sectionIcon}>
                                <Bell />
                            </div>
                            <div className={styles.sectionTitleText}>
                                <h2>On This Day</h2>
                                <p>Memories from years past</p>
                            </div>
                        </div>
                        <a href="#" className={styles.sectionLink}>
                            View all <ChevronRight />
                        </a>
                    </div>

                    <div className={styles.memoryCards}>
                        {onThisDayMemories.map((memory, i) => (
                            <div key={i} className={styles.memoryCard}>
                                <div className={styles.memoryEmoji}>{memory.emoji}</div>
                                <p className={styles.memoryYear}>{memory.year}</p>
                                <p className={styles.memoryTitle}>{memory.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Memories Section */}
            <section className={styles.recentMemories}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitleText}>
                        <h2>Recent Memories</h2>
                        <p>Your latest captured moments</p>
                    </div>

                    <div className={styles.filterTabs}>
                        {['All', 'Photos', 'Videos', 'Stories'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`${styles.filterTab} ${activeFilter === filter
                                    ? styles.filterTabActive
                                    : styles.filterTabInactive
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.polaroidGrid}>
                    {recentMemories.map((memory) => (
                        <div key={memory.id} className={styles.polaroidItem}>
                            <div
                                className={styles.polaroidCard}
                                style={{ transform: `rotate(${memory.rotation}deg)` }}
                            >
                                <div className={styles.polaroidCardImage}>
                                    <span>{memory.emoji}</span>
                                </div>
                                <div className={styles.polaroidCardCaption}>
                                    <h4>{memory.title}</h4>
                                    <div className={styles.polaroidCardMeta}>
                                        <span><Clock />{memory.date}</span>
                                        <span><MapPin />{memory.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.loadMore}>
                    <button className={styles.loadMoreBtn}>Load More Memories</button>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className={styles.statsInner}>
                    {stats.map((stat, i) => (
                        <div key={i} className={styles.statCard}>
                            <div className={styles.statEmoji}>{stat.emoji}</div>
                            <p className={styles.statNumber}>{stat.number}</p>
                            <p className={styles.statLabel}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <Link href="/album" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Heart />
                        </div>
                        <div>
                            <span className={styles.logoText}>
                                Muthee
                                <span className={styles.logoTextMuted}>Family Album</span>
                            </span>
                        </div>
                    </Link>

                    <div className={styles.footerLinks}>
                        <Link href="#" className={styles.footerLink}>Privacy</Link>
                        <Link href="#" className={styles.footerLink}>Terms</Link>
                        <Link href="#" className={styles.footerLink}>Contact</Link>
                    </div>

                    <p className={styles.footerCopyright}>
                        © {new Date().getFullYear()} Muthee Family
                    </p>
                </div>
            </footer>
        </div>
    )
}