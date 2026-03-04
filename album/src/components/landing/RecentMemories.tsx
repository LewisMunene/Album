import { Clock, MapPin } from 'lucide-react'

const memories = [
    { id: 1, title: 'Christmas Morning', date: 'Dec 25, 2024', location: 'Home', emoji: '🎄', rotation: -3 },
    { id: 2, title: 'Beach Getaway', date: 'Dec 20, 2024', location: 'Mombasa', emoji: '🏖️', rotation: 4 },
    { id: 3, title: 'Birthday Party', date: 'Nov 15, 2024', location: 'Nairobi', emoji: '🎂', rotation: -2 },
    { id: 4, title: 'Sunday Brunch', date: 'Nov 10, 2024', location: "Grandma's", emoji: '🍳', rotation: 3 },
    { id: 5, title: 'Road Trip', date: 'Oct 28, 2024', location: 'Nakuru', emoji: '🚗', rotation: -4 },
    { id: 6, title: 'Garden Party', date: 'Oct 15, 2024', location: 'Home', emoji: '🌻', rotation: 2 },
]

export default function RecentMemories() {
    return (
        <section className="py-16 px-8 lg:px-12 xl:px-16">
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                    <div>
                        <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-2">Recent Memories</h2>
                        <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>Your latest captured moments</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        {['All', 'Photos', 'Videos', 'Stories'].map((filter, i) => (
                            <button
                                key={filter}
                                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                                style={i === 0 ? {
                                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                                    color: 'white',
                                } : {
                                    backgroundColor: 'var(--color-card)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-muted)'
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Polaroid Grid - cleaner layout without timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {memories.map((memory) => (
                        <div
                            key={memory.id}
                            className="flex justify-center"
                        >
                            {/* Polaroid Card - constrained width for proper sizing */}
                            <div
                                className="polaroid cursor-pointer w-full max-w-[300px]"
                                style={{ transform: `rotate(${memory.rotation}deg)` }}
                            >
                                {/* Photo - 4:3 aspect ratio for better proportions */}
                                <div
                                    className="aspect-[4/3] rounded-sm flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--color-bg-alt)' }}
                                >
                                    <span className="text-5xl">{memory.emoji}</span>
                                </div>

                                {/* Caption */}
                                <div className="mt-4 text-center">
                                    <p className="font-medium text-base mb-2">{memory.title}</p>
                                    <div
                                        className="flex items-center justify-center gap-4 text-xs"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {memory.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {memory.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More - increased top margin and clear spacing */}
                <div className="text-center mt-20 relative z-10">
                    <button
                        className="px-8 py-3 rounded-lg text-base font-medium transition-all hover:-translate-y-0.5"
                        style={{
                            backgroundColor: 'var(--color-card)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-muted)'
                        }}
                    >
                        Load More Memories
                    </button>
                </div>
            </div>
        </section>
    )
}