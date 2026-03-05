// prisma/seed.ts
// Run with: npx ts-node prisma/seed.ts
// Or add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...\n')

    // Create the first admin user
    const adminEmail = 'admin@mutheefamily.com'
    const adminPassword = 'changeme123' // Change this immediately after first login!

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    if (existingAdmin) {
        console.log('✅ Admin user already exists:', adminEmail)
    } else {
        const hashedPassword = await bcrypt.hash(adminPassword, 12)

        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'Family Admin',
                password: hashedPassword,
                role: 'ADMIN',
            }
        })

        console.log('✅ Admin user created:')
        console.log('   Email:', admin.email)
        console.log('   Password:', adminPassword)
        console.log('   ⚠️  IMPORTANT: Change this password immediately after first login!')
    }

    console.log('\n🎉 Seeding complete!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })