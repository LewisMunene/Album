'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
    Heart,
    Sun,
    Moon,
    Menu,
    X,
    Plus,
    LogOut,
    User,
    Settings,
    ChevronDown
} from 'lucide-react'
import styles from './DashboardNavbar.module.css'

interface DashboardNavbarProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
    onAddMemory?: () => void
}

const navLinks = [
    { href: '/album', label: 'Memories' },
    { href: '/albums', label: 'Albums' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/family', label: 'Family' },
]

export default function DashboardNavbar({ user, onAddMemory }: DashboardNavbarProps) {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    const isActive = (href: string) => {
        if (href === '/album') {
            return pathname === '/album' || pathname === '/gallery'
        }
        return pathname?.startsWith(href)
    }

    const getInitials = (name?: string | null) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.navInner}>
                    {/* Logo */}
                    <Link href="/album" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Heart />
                        </div>
                        <span className={styles.logoText}>
                            Muthee<span className={styles.logoTextMuted}>Family</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className={styles.navLinks}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className={styles.navActions}>
                        {/* Add Memory Button */}
                        <button
                            onClick={onAddMemory}
                            className={styles.addButton}
                        >
                            <Plus />
                            <span>Add Memory</span>
                        </button>

                        {/* User Menu */}
                        <div className={styles.userMenuWrapper}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className={styles.userButton}
                            >
                                <div className={styles.userAvatar}>
                                    {getInitials(user.name)}
                                </div>
                                <ChevronDown className={styles.chevron} />
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div
                                        className={styles.menuBackdrop}
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className={styles.userMenu}>
                                        <div className={styles.userMenuHeader}>
                                            <p className={styles.userName}>{user.name || 'User'}</p>
                                            <p className={styles.userEmail}>{user.email}</p>
                                        </div>
                                        <div className={styles.userMenuDivider} />
                                        <Link
                                            href="/profile"
                                            className={styles.userMenuItem}
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <User />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className={styles.userMenuItem}
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Settings />
                                            <span>Settings</span>
                                        </Link>
                                        <div className={styles.userMenuDivider} />
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className={`${styles.userMenuItem} ${styles.userMenuItemDanger}`}
                                        >
                                            <LogOut />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className={styles.mobileMenuBtn}
                        >
                            <Menu />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div
                        className={styles.mobileBackdrop}
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className={styles.mobileMenu}>
                        <div className={styles.mobileMenuHeader}>
                            <div className={styles.logo}>
                                <div className={styles.logoIcon}>
                                    <Heart />
                                </div>
                                <span className={styles.logoText}>Muthee</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className={styles.mobileCloseBtn}
                            >
                                <X />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className={styles.mobileUserInfo}>
                            <div className={styles.userAvatar}>
                                {getInitials(user.name)}
                            </div>
                            <div>
                                <p className={styles.userName}>{user.name || 'User'}</p>
                                <p className={styles.userEmail}>{user.email}</p>
                            </div>
                        </div>

                        {/* Mobile Nav Links */}
                        <nav className={styles.mobileNavLinks}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.mobileNavLinkActive : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Actions */}
                        <div className={styles.mobileActions}>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false)
                                    onAddMemory?.()
                                }}
                                className={styles.mobileAddBtn}
                            >
                                <Plus /> Add Memory
                            </button>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className={styles.mobileSignOutBtn}
                            >
                                <LogOut /> Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}