import { Bell, ChevronRight } from 'lucide-react'

const memories = [
    { year: '2023', title: 'First Day of School', emoji: '📚' },
    { year: '2022', title: 'Family Reunion', emoji: '👨‍👩‍👧‍👦' },
    { year: '2020', title: 'Lockdown Baking', emoji: '🍪' },
    { year: '2019', title: 'Beach Vacation', emoji: '🏖️' },
]

export default function OnThisDay() {
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
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                        >
                            <Bell className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                        </div>
                        <div>
                            <h2 className="font-display text-xl font-semibold mb-1">On This Day</h2>
                            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                                Memories from years past
                            </p>
                        </div>
                    </div>
                    <a
                        href="#"
                        className="hidden sm:flex items-center gap-1.5 text-sm font-medium"
                        style={{ color: 'var(--color-accent)' }}
                    >
                        View all <ChevronRight className="w-4 h-4" />
                    </a>
                </div>

                {/* Memory Cards */}
                <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
                    {memories.map((memory, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-44 p-5 rounded-xl cursor-pointer transition-all hover:-translate-y-1"
                            style={{
                                backgroundColor: 'var(--color-card)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <div className="text-4xl mb-4">{memory.emoji}</div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-accent)' }}>
                                {memory.year}
                            </p>
                            <p className="font-medium text-base">{memory.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}