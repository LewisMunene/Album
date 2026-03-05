import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer
            className="py-12 px-8 lg:px-12 xl:px-16"
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
                        <Link
                            href="https://www.linkedin.com/in/lewis-muthee-4990121aa/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-500 to-red-700 text-xs font-medium animate-pulse hover:scale-105 transition-transform duration-300 block text-center cursor-pointer"
                        >
                            Built by the amazing Lewis Munene Muthee ;D
                        </Link>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        © {new Date().getFullYear()} Muthee Family
                    </p>
                </div>
            </div>
        </footer>
    )
}