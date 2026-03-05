import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/providers/AuthProvider'

export const metadata: Metadata = {
    title: "Muthee's Family Album",
    description: 'A private sanctuary where we preserve our memories, share our stories, and celebrate the bonds that make us family.',
    keywords: ['family', 'photos', 'album', 'memories', 'gallery'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}