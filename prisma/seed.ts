// import {PrismaClient} from '@prisma/client'
import {PrismaClient, Role} from '@prisma/client'

const prisma = new PrismaClient()

async function main()    {
    await prisma.user.upsert({
        where: {email: 'superadmin@test.com'},
        update: {},
        create: {
            name: 'superadmin',
            email: 'superadmin@test.com',
            role: Role.SUPER_ADMIN
        }
    })

    const admin1 = await prisma.user.upsert({
        where: {email: 'admin1@test.com'},
        update: {},
        create: {
            name: 'admin1',
            email: 'admin1@test.com',
            role: Role.ADMIN
        }
    })

    const admin2 = await prisma.user.upsert({
        where: {email: 'admin2@test.com'},
        update: {},
        create: {
            name: 'admin2',
            email: 'admin2@test.com',
            role: Role.ADMIN
        }
    })

    const user1 = await prisma.user.upsert({
        where: {email: 'user1@test.com'},
        update: {},
        create: {
            name: 'user1',
            email: 'user1@test.com',
            role: Role.USER
        }
    })

    await prisma.user.upsert({
        where: {email: 'user2@test.com'},
        update: {},
        create: {
            name: 'user2',
            email: 'user2@test.com',
            role: Role.USER
        }
    })

    const project1 = await prisma.project.create({
        data: {
            name: 'Admin 1 project',
            ownerId: admin1.id,
        }
    })

    const project2 = await prisma.project.create({
        data: {
            name: 'Admin 2 project',
            ownerId: admin2.id,
        }
    })

    // explicit access: user1 -> admin1 project
    await prisma.projectAccess.create({
        data: {
            userId: user1.id,
            projectId: project1.id,
        }
    })

    // Create analyses
    await prisma.analyses.create({
        data: {
            name: 'Admin 1 analyse 1',
            projectId: project1.id,
            creatorId: admin1.id,
        }
    })

    await prisma.analyses.create({
        data: {
            name: 'Admin 1 analyse 2',
            projectId: project1.id,
            creatorId: admin1.id,
        }
    })

    await prisma.analyses.create({
        data: {
            name: 'Admin 2 analyse 1',
            projectId: project2.id,
            creatorId: admin2.id,
        }
    })
}

const userData = [
    ["Super Admin", 'superadmin@test.com'],
    ["Admin 1", 'admin1@test.com'],
    ["Admin 2", 'admin2@test.com'],
    ["User 1", 'user1@test.com'],
    ["User 2", 'user2@test.com']
]


console.log("Test data created successfully!")
console.table(userData)


main().catch((err) => {
    console.error(err)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
})
