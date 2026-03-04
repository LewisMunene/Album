import Link from 'next/link'
import { Sparkles, Search, ArrowRight } from 'lucide-react'

export default function Hero() {
    return (
        <section className="pt-28 pb-16 px-8 lg:px-12 xl:px-16">
            <div className="w-full">
                <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

                    {/* Left Content */}
                    <div className="lg:pl-4 xl:pl-8">
                        {/* Welcome Badge */}
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                            style={{ backgroundColor: 'var(--color-bg-alt)' }}
                        >
                            <Sparkles className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                            <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                                Welcome back
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
                            Every moment
                            <br />
                            <span style={{ color: 'var(--color-accent)' }}>tells a story</span>
                        </h1>

                        {/* Description */}
                        <p
                            className="text-lg leading-relaxed mb-8 max-w-lg"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Your family's memories, beautifully preserved. Browse through
                            generations of love, laughter, and legacy.
                        </p>

                        {/* Search Bar */}
                        <div
                            className="flex items-center p-2 rounded-xl max-w-md mb-8"
                            style={{
                                backgroundColor: 'var(--color-card)',
                                border: '1px solid var(--color-border)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                        >
                            <div className="flex items-center gap-3 flex-1 px-4">
                                <Search className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Search memories..."
                                    className="flex-1 bg-transparent text-base outline-none py-2"
                                />
                            </div>
                            <button
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white"
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))'
                                }}
                            >
                                Search
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap gap-6">
                            <Link
                                href="/gallery"
                                className="inline-flex items-center gap-2 text-base font-medium group"
                                style={{ color: 'var(--color-accent)' }}
                            >
                                Browse Gallery
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <Link
                                href="/upload"
                                className="inline-flex items-center gap-2 text-base font-medium"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Upload Photos
                            </Link>
                        </div>
                    </div>

                    {/* Right - Polaroids */}
                    <div className="relative h-[400px] lg:h-[450px] hidden md:block lg:pr-4 xl:pr-8">
                        {/* Decorative blur */}
                        <div
                            className="absolute top-20 right-20 w-48 h-48 rounded-full blur-3xl opacity-20"
                            style={{ backgroundColor: 'var(--color-accent)' }}
                        />

                        {/* Polaroid 1 */}
                        <div
                            className="absolute top-8 left-8 polaroid w-44 lg:w-52 animate-float"
                            style={{ transform: 'rotate(-6deg)' }}
                        >
                            <div
                                className="aspect-[4/3] rounded-sm flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #d4e7d4 0%, #b8d4b8 100%)' }}
                            >
                                <span className="text-4xl">📸</span>
                            </div>
                            <p className="text-center text-sm mt-3 font-medium whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                                Summer 2024
                            </p>
                        </div>

                        {/* Polaroid 2 */}
                        <div
                            className="absolute top-24 right-8 polaroid w-40 lg:w-48"
                            style={{ transform: 'rotate(8deg)' }}
                        >
                            <div
                                className="aspect-square rounded-sm flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #f5e6dc 0%, #e8d4c4 100%)' }}
                            >
                                <span className="text-3xl">🎉</span>
                            </div>
                            <p className="text-center text-sm mt-3 font-medium whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                                Celebrations
                            </p>
                        </div>

                        {/* Polaroid 3 */}
                        <div
                            className="absolute bottom-8 left-1/4 polaroid w-44 lg:w-52"
                            style={{ transform: 'rotate(-3deg)' }}
                        >
                            <div
                                className="aspect-[3/4] rounded-sm flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #e8f0e8 0%, #d4e4d4 100%)' }}
                            >
                                <span className="text-4xl">❤️</span>
                            </div>
                            <p className="text-center text-sm mt-3 font-medium whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                                Together
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}