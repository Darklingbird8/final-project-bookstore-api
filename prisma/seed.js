import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

try {
    await prisma.order_Items.deleteMany();
    await prisma.orders.deleteMany();
    await prisma.books.deleteMany();
    await prisma.authors.deleteMany();
    await prisma.users.deleteMany();

    console.log("database cleared");

    const usersData = [
        {
            email: 'user@gmail.com',
            password: await bcrypt.hash('user1234', 10),
        },
        {
            email: 'frank@gmail.com',
            password: await bcrypt.hash('frank1234', 10),
        },
        {
            email: 'admin@gmail.com',
            password: await bcrypt.hash('admin1234', 10),
            role: 'ADMIN',
        },
    ];

    const users = await Promise.all(
        usersData.map((user) => prisma.user.create({ data: user })),
    );

    console.log("users created");

    const authorsData = [
        { name: 'Brandon Sanderson' },
        { name: 'George Orwell' },
    ];

    const authors = await Promise.all(
        authorsData.map((author) => prisma.authors.create({ data: author }))
    );

    console.log("authors created");

    const booksData = [
        {
            title: 'The Way of Kings',
            price: 9.99,
            stock: 20,
            authorId: authors.find(a => a.name === 'Brandon Sanderson').id,
        },
        {
            title: '1984',
            price: 14.99,
            stock: 15,
            authorId: authors.find(a => a.name === 'George Orwell').id,
        },
    ];

    const books = await Promise.all(
        booksData.map((book) => prisma.books.create({ data: book })),
    );

    console.log("authors and books created");

    const order1 = await prisma.orders.create({
        data: {
            userId: users[0].id,
            status: 'PENDING',
            orderItems: {
                create: [
                    {
                        bookId: books[0].id,
                        quantity: 2,
                    },
                    {
                        bookId: books[1].id,
                        quantity: 1,
                    },
                ]
            }
        }
    });

    const order2 = await prisma.orders.create({
        data: {
            userId: users[1].id,
            status: 'COMPLETED',
            orderItems: {
                create: [
                    {
                        bookId: books[0].id,
                        quantity: 1,
                    },
                ]
            }
        }
    });

    console.log("orders created");

    console.log('Seed completed successfully!');
} catch (error) {
    console.error('Seed failed:', error);
} finally {
    await prisma.$disconnect();
}
