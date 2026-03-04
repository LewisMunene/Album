const stats = [
    { number: '3', label: 'Generations', emoji: '👨‍👩‍👧‍👦' },
    { number: '247', label: 'Memories', emoji: '📸' },
    { number: '12', label: 'Albums', emoji: '📁' },
    { number: '8', label: 'Family Members', emoji: '❤️' },
]

export default function Stats() {
    return (
        <section
            className="py-14 px-8 lg:px-12 xl:px-16"
            style={{
                backgroundColor: 'var(--color-bg-alt)',
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)'
            }}
        >
            <div className="w-full">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="text-center p-8 rounded-xl transition-all hover:-translate-y-1"
                            style={{
                                backgroundColor: 'var(--color-card)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <div className="text-4xl mb-3">{stat.emoji}</div>
                            <p
                                className="font-display text-4xl font-semibold mb-2"
                                style={{ color: 'var(--color-accent)' }}
                            >
                                {stat.number}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}