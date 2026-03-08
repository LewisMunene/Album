// src/components/public/PublicHomepage.tsx
'use client'

import Link from 'next/link'
import { Heart, Camera, BookOpen, Users, Calendar, Play, ArrowRight, Lock, Sparkles, Menu } from 'lucide-react'
import styles from './PublicHomepage.module.css'

const features = [
    {
        icon: Camera,
        title: 'Photo Gallery',
        description: 'Browse through our collection of family photos organized by events and albums.',
        color: '#E8B4B8',
        link: 'View Photos'
    },
    {
        icon: BookOpen,
        title: 'Family Stories',
        description: 'Read and share stories, memories, and wisdom passed down through generations.',
        color: '#D4A574',
        link: 'Read Stories'
    },
    {
        icon: Users,
        title: 'Family Tree',
        description: 'Explore our family tree and discover the connections that bind us together.',
        color: '#8BB48B',
        link: 'View Tree'
    },
    {
        icon: Heart,
        title: 'Tributes',
        description: 'Honor and remember family members who have shaped our legacy.',
        color: '#C9A0C9',
        link: 'View Tributes'
    },
    {
        icon: Calendar,
        title: 'Family Events',
        description: 'Stay connected with upcoming reunions, birthdays, and celebrations.',
        color: '#7EB6D4',
        link: 'View Events'
    },
    {
        icon: Play,
        title: 'Family Videos',
        description: 'Watch and relive special moments through our video collection.',
        color: '#E8C49A',
        link: 'Watch Videos'
    },
]

const stats = [
    { number: '3', label: 'Generations' },
    { number: '10+', label: 'Family Members' },
    { number: '100+', label: 'Shared Memories' },
    { number: '1', label: 'United Family' },
]

export default function PublicHomepage() {
    return (
        <div className={styles.page}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={styles.navInner}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
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
                        <Link href="/" className={`${styles.navLink} ${styles.navLinkActive}`}>
                            Home
                        </Link>
                        <Link href="/about" className={styles.navLink}>
                            About Us
                        </Link>
                    </div>

                    {/* CTA */}
                    <Link href="/auth/login" className={styles.navCta}>
                        Enter Album
                    </Link>

                    {/* Mobile Menu */}
                    <button className={styles.mobileMenu}>
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                {/* Background Elements */}
                <div className={styles.heroBackground}>
                    <div className={`${styles.heroGradient} ${styles.heroGradient1}`} />
                    <div className={`${styles.heroGradient} ${styles.heroGradient2}`} />
                </div>

                <div className={styles.heroInner}>
                    {/* Left Content */}
                    <div className={styles.heroContent}>
                        <div className={styles.heroLabel}>
                            <Sparkles />
                            Welcome to our family
                        </div>

                        <h1 className={styles.heroTitle}>
                            The Muthee
                            <span className={styles.heroTitleAccent}>Family Album</span>
                        </h1>

                        <p className={styles.heroDescription}>
                            A private sanctuary where we preserve our memories, share our stories,
                            and celebrate the bonds that make us family.
                        </p>

                        <div className={styles.heroActions}>
                            <Link href="/auth/login" className={styles.btnPrimary}>
                                Enter the Album
                                <ArrowRight />
                            </Link>
                            <Link href="/about" className={styles.btnSecondary}>
                                Learn About Us
                            </Link>
                        </div>
                    </div>

                    {/* Right - Polaroids */}
                    <div className={styles.heroPolaroids}>
                        {/* Polaroid 1 */}
                        <div className={`${styles.polaroid} ${styles.polaroid1}`}>
                            <div
                                className={styles.polaroidImage}
                                style={{ background: 'linear-gradient(145deg, #c8ddc8 0%, #a8c8a8 100%)' }}
                            >
                                <Camera />
                            </div>
                            <span className={styles.polaroidCaption}>Summer 2024</span>
                        </div>

                        {/* Polaroid 2 */}
                        <div className={`${styles.polaroid} ${styles.polaroid2}`}>
                            <div
                                className={styles.polaroidImage}
                                style={{ background: 'linear-gradient(145deg, #f0e0d0 0%, #e0cfc0 100%)' }}
                            >
                                <Heart />
                            </div>
                            <span className={styles.polaroidCaption}>Celebrations</span>
                        </div>

                        {/* Polaroid 3 */}
                        <div className={`${styles.polaroid} ${styles.polaroid3}`}>
                            <div
                                className={styles.polaroidImage}
                                style={{ background: 'linear-gradient(145deg, #d8e8f0 0%, #c0d8e8 100%)' }}
                            >
                                <Users />
                            </div>
                            <span className={styles.polaroidCaption}>Together</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className={styles.statsPattern} />
                <div className={styles.statsInner}>
                    {stats.map((stat, i) => (
                        <div key={i} className={styles.statItem}>
                            <p className={styles.statNumber}>{stat.number}</p>
                            <p className={styles.statLabel}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <div className={styles.featuresInner}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionLabel}>Explore</span>
                        <h2 className={styles.sectionTitle}>What's Inside the Album</h2>
                        <p className={styles.sectionDescription}>
                            Everything you need to preserve, share, and celebrate our family's unique story.
                        </p>
                    </div>

                    <div className={styles.featuresGrid}>
                        {features.map((feature, i) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={i}
                                    className={styles.featureCard}
                                    style={{ '--card-accent': feature.color } as React.CSSProperties}
                                >
                                    <div
                                        className={styles.featureIcon}
                                        style={{ backgroundColor: `${feature.color}25` }}
                                    >
                                        <Icon style={{ color: feature.color }} />
                                    </div>
                                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                                    <p className={styles.featureDescription}>{feature.description}</p>
                                    <div className={styles.featureLink}>
                                        {feature.link}
                                        <ArrowRight />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* CTA */}
                    <div className={styles.cta}>
                        <div className={styles.ctaBadge}>
                            <Lock />
                            <span>Login required to access the album</span>
                        </div>
                        <div>
                            <Link href="/auth/login" className={styles.ctaButton}>
                                Enter the Album
                                <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
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

                    {/* Links */}
                    <div className={styles.footerLinks}>
                        <Link href="#" className={styles.footerLink}>Privacy</Link>
                        <Link href="#" className={styles.footerLink}>Terms</Link>
                        <Link href="#" className={styles.footerLink}>Contact</Link>
                    </div>

                    {/* Copyright */}
                    <p className={styles.footerCopyright}>
                        © {new Date().getFullYear()} Muthee Family
                    </p>
                </div>
            </footer>
        </div>
    )
}