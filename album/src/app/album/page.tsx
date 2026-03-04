'use client'

import { useState, useEffect } from 'react'
import { Navbar, Hero, OnThisDay, RecentMemories, Stats, Footer } from '@/components/landing'

// TODO: Add authentication check here
// import { useAuth } from '@/hooks/useAuth'
// import { redirect } from 'next/navigation'

export default function AlbumPage() {
    const [isDark, setIsDark] = useState(false)

    // TODO: Uncomment when auth is set up
    // const { isLoggedIn, isLoading } = useAuth()
    // 
    // if (isLoading) {
    //     return <div>Loading...</div>
    // }
    // 
    // if (!isLoggedIn) {
    //     redirect('/auth/login')
    // }

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDark])

    return (
        <div
            className="min-h-screen transition-colors duration-300"
            style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
            <Navbar isDark={isDark} setIsDark={setIsDark} />
            <Hero />
            <OnThisDay />
            <RecentMemories />
            <Stats />
            <Footer />
        </div>
    )
}