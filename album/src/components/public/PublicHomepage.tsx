'use client'

import Link from 'next/link'
import { Heart, Camera, BookOpen, Users, Calendar, Play, ArrowRight, Lock } from 'lucide-react'

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
        color: '#F5D5A8',
        link: 'Read Stories'
    },
    {
        icon: Users,
        title: 'Family Tree',
        description: 'Explore our family tree and discover the connections that bind us together.',
        color: '#B8D4B8',
        link: 'View Tree'
    },
    {
        icon: Heart,
        title: 'Tributes',
        description: 'Honor and remember family members who have shaped our legacy.',
        color: '#D4B8D4',
        link: 'View Tributes'
    },
    {
        icon: Calendar,
        title: 'Family Events',
        description: 'Stay connected with upcoming reunions, birthdays, and celebrations.',
        color: '#B8D4E8',
        link: 'View Events'
    },
    {
        icon: Play,
        title: 'Family Videos',
        description: 'Watch and relive special moments through our video collection.',
        color: '#F5C8A8',
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
        <div
            className="min-h-screen"
            style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
            {/* Navigation */}
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
                            <div>
                                <span className="font-display text-lg font-semibold">Muthee</span>
                                <span className="text-lg ml-1" style={{ color: 'var(--color-text-muted)' }}>Family</span>
                            </div>
                        </Link>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-full text-sm font-medium"
                                style={{ backgroundColor: 'var(--color-bg-alt)' }}
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm font-medium"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                About Us
                            </Link>
                        </div>

                        {/* CTA */}
                        <Link
                            href="/auth/login"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium"
                            style={{
                                background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                                boxShadow: '0 2px 8px rgba(196, 149, 106, 0.25)'
                            }}
                        >
                            Enter Album
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-24 px-8 lg:px-12 xl:px-16">
                <div className="w-full">
                    <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
                        {/* Left Content */}
                        <div>
                            <p
                                className="text-sm font-semibold tracking-wider uppercase mb-4"
                                style={{ color: 'var(--color-accent)' }}
                            >
                                Welcome to our family
                            </p>

                            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
                                The Muthee
                                <br />
                                <span style={{ color: 'var(--color-accent)' }}>Family Album</span>
                            </h1>

                            <p
                                className="text-lg leading-relaxed mb-8 max-w-lg"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                A private sanctuary where we preserve our memories, share our stories,
                                and celebrate the bonds that make us family.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                                        boxShadow: '0 4px 14px rgba(196, 149, 106, 0.3)'
                                    }}
                                >
                                    Enter the Album
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/about"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium"
                                    style={{
                                        backgroundColor: 'var(--color-card)',
                                        border: '1px solid var(--color-border)'
                                    }}
                                >
                                    Learn About Us
                                </Link>
                            </div>
                        </div>

                        {/* Right - Polaroids */}
                        <div className="relative h-[400px] lg:h-[500px] hidden md:block">
                            {/* Decorative blur */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20"
                                style={{ backgroundColor: 'var(--color-accent)' }}
                            />

                            {/* Polaroid 1 - Top Left */}
                            <div
                                className="absolute top-8 left-8 polaroid w-48 lg:w-56"
                                style={{ transform: 'rotate(-8deg)' }}
                            >
                                <div
                                    className="aspect-[4/3] rounded-sm flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #d4e7d4 0%, #b8d4b8 100%)' }}
                                >
                                    <Camera className="w-12 h-12" style={{ color: 'var(--color-accent)', opacity: 0.5 }} />
                                </div>
                            </div>

                            {/* Polaroid 2 - Top Right (with "photo") */}
                            <div
                                className="absolute top-16 right-4 polaroid w-44 lg:w-52"
                                style={{ transform: 'rotate(6deg)' }}
                            >
                                <div
                                    className="aspect-square rounded-sm flex items-center justify-center relative overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #f5e6dc 0%, #e8d4c4 100%)' }}
                                >
                                    <Heart className="w-10 h-10" style={{ color: 'var(--color-accent)' }} />
                                </div>
                            </div>

                            {/* Polaroid 3 - Bottom Center */}
                            <div
                                className="absolute bottom-8 left-1/4 polaroid w-48 lg:w-56"
                                style={{ transform: 'rotate(-3deg)' }}
                            >
                                <div
                                    className="aspect-[3/4] rounded-sm flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #e8f0e8 0%, #d4e4d4 100%)' }}
                                >
                                    <Users className="w-12 h-12" style={{ color: 'var(--color-accent)', opacity: 0.5 }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section
                className="py-16 px-8 lg:px-12 xl:px-16"
                style={{ backgroundColor: 'var(--color-accent)' }}
            >
                <div className="w-full">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center text-white">
                                <p className="font-display text-5xl lg:text-6xl font-semibold mb-2">
                                    {stat.number}
                                </p>
                                <p className="text-base opacity-80">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What's Inside Section */}
            <section className="py-24 px-8 lg:px-12 xl:px-16">
                <div className="w-full">
                    {/* Header */}
                    <div className="text-center mb-16 px-4">
                        <h2 className="font-display text-3xl lg:text-4xl font-semibold mb-6">
                            What's Inside the Album
                        </h2>
                        <p
                            className="text-lg max-w-2xl mx-auto leading-relaxed"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Everything you need to preserve, share, and celebrate our family's unique story.
                        </p>
                    </div>

                    {/* Feature Cards - Full Width */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {features.map((feature, i) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={i}
                                    className="p-8 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg"
                                    style={{
                                        backgroundColor: 'var(--color-card)',
                                        border: '1px solid var(--color-border)'
                                    }}
                                >
                                    {/* Icon */}
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                                        style={{ backgroundColor: feature.color + '30' }}
                                    >
                                        <Icon className="w-7 h-7" style={{ color: feature.color }} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-display text-xl font-semibold mb-3">
                                        {feature.title}
                                    </h3>
                                    <p
                                        className="text-base mb-5 leading-relaxed"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {feature.description}
                                    </p>

                                    {/* Link */}
                                    <div
                                        className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer hover:gap-3 transition-all"
                                        style={{ color: 'var(--color-accent)' }}
                                    >
                                        {feature.link}
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <div
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm mb-8"
                            style={{ backgroundColor: 'var(--color-bg-alt)' }}
                        >
                            <Lock className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                            <span style={{ color: 'var(--color-text-muted)' }}>
                                Login required to access the album
                            </span>
                        </div>
                        <div>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-medium text-lg transition-all hover:-translate-y-0.5"
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                                    boxShadow: '0 4px 14px rgba(196, 149, 106, 0.3)'
                                }}
                            >
                                Enter the Album
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                className="py-14 px-8 lg:px-12 xl:px-16"
                style={{ borderTop: '1px solid var(--color-border)' }}
            >
                <div className="w-full">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))'
                                }}
                            >
                                <Heart className="w-5 h-5 text-white fill-white" />
                            </div>
                            <div>
                                <span className="font-display text-base font-semibold">Muthee</span>
                                <span className="text-base ml-1" style={{ color: 'var(--color-text-muted)' }}>
                                    Family Album
                                </span>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            <Link href="#" className="hover:opacity-70 transition-opacity">Privacy</Link>
                            <Link href="#" className="hover:opacity-70 transition-opacity">Terms</Link>
                            <Link href="#" className="hover:opacity-70 transition-opacity">Contact</Link>
                        </div>

                        {/* Copyright */}
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            © {new Date().getFullYear()} Muthee Family
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}