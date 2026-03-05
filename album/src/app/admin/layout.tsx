// src/app/admin/layout.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect('/auth/login')
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
        redirect('/album')
    }

    return <>{children}</>
}