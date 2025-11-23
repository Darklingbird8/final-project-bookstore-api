import prisma from '../config/db.js';

export async function createUser(data) {
    return await prisma.users.create({
        data: data,
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
}

export async function findUserByEmail(email) {
    return await prisma.users.findUnique({ where: { email } });
}

export async function findAllUsers() {
    return await prisma.users.findMany({
        select: {
            id: true,
            email: true,
            role: true,
        },
        orderBy: {
            id: 'asc',
        },
    });
}

export async function findUserById(id) {
    return await prisma.users.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
}

export async function updateUser(id, data) {
    return await prisma.users.update({
        where: { id },
        data,
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
}

export async function deleteUser(id) {
    return await prisma.users.delete({
        where: { id },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
}