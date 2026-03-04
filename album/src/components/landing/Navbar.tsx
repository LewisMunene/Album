'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Sun, Moon, Menu, X, Plus } from 'lucide-react'

interface NavbarProps {
    isDark: boolean
    setIsDark: (value: boolean) => void
}

export default function Navbar({ isDark, setIsDark }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 glass"
                style={{ borderBottom: '1px solid var(--color-border)' }}
            >
                <div className="w-full px-8 lg:px-12 xl:px-16 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                                    boxShadow: '0 2px 8px rgba(196, 149, 106, 0.25)'
                                }}
                            >
                                <Heart className="w-5 h-5 text-white fill-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-display text-lg font-semibold">Muthee</span>
                                <span className="text-lg ml-0.5" style={{ color: 'var(--color-text-muted)' }}>Family</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {['Memories', 'Albums', 'Timeline', 'Family'].map((item, i) => (
                                <Link
                                    key={item}
                                    href="#"
                                    className="text-base font-medium transition-colors"
                                    style={{ color: i === 0 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="p-2.5 rounded-lg transition-all"
                                style={{ backgroundColor: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <Link
                                href="/upload"
                                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium"
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                                    boxShadow: '0 2px 8px rgba(196, 149, 106, 0.25)'
                                }}
                            >
                                <Plus className="w-4 h-4" />
                                Add Memory
                            </Link>

                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2.5 rounded-lg"
                                style={{ backgroundColor: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/50"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div
                        className="fixed top-0 right-0 bottom-0 w-80 z-50 p-6 shadow-2xl"
                        style={{ backgroundColor: 'var(--color-card)' }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}
                                >
                                    <Heart className="w-5 h-5 text-white fill-white" />
                                </div>
                                <span className="font-display text-base font-semibold">Muthee</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-muted)' }}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="space-y-2">
                            {['Memories', 'Albums', 'Timeline', 'Family'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    className="block px-4 py-3 rounded-lg text-base font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-8 space-y-3">
                            <Link
                                href="/auth/login"
                                className="block w-full text-center py-3 rounded-lg text-base font-medium"
                                style={{ border: '1px solid var(--color-border)' }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/register"
                                className="block w-full text-center py-3 rounded-lg text-base font-medium text-white"
                                style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))' }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}