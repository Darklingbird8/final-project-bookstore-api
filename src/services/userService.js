import { Prisma } from '../generated/prisma/index.js';
import {
    createUser,
    findAllUsers,
    findUserById,
    findUserByEmail,
    updateUser,
    deleteUser,
} from '../repositories/userRepo.js';
import { findOrdersByUser } from '../repositories/orderRepo.js';
import bcrypt from 'bcrypt';

export async function getAllUsers() {
    return await findAllUsers();
}

export async function createUserService(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const normalizedEmail = String(userData.email).trim().toLowerCase();
    const userToCreate = {
        email: normalizedEmail,
        password: hashedPassword,
        role: userData.role || 'USER',
    };

    try {
        return await createUser(userToCreate);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const err = new Error('Email has already been used');
                err.status = 409;
                throw err;
            }
        }
        throw error;
    }
}

export async function getUserById(id) {
    const user = await findUserById(id);
    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return user;
}

export async function updateUserById(id, { email, password }) {
    // Check if user exists
    const existingUser = await findUserById(id);
    if (!existingUser) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    const data = {};

    if (email) {
        const normalized = String(email).trim().toLowerCase();
        const emailUser = await findUserByEmail(normalized);
        if (emailUser && Number(emailUser.id) !== Number(id)) {
            const err = new Error('Email already in use');
            err.status = 409;
            throw err;
        }
        data.email = normalized;
    }

    if (password) data.password = await bcrypt.hash(String(password), 10);

    if (Object.keys(data).length === 0) {
        // No fields to update
        return existingUser;
    }

    try {
        return await updateUser(id, data);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                const err = new Error('User not found');
                err.status = 404;
                throw err;
            }
        }
        throw error;
    }
}

export async function deleteUserById(id) {
    // Check if user exists
    const existingUser = await findUserById(id);
    if (!existingUser) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    try {
        return await deleteUser(id);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                const err = new Error('User not found');
                err.status = 404;
                throw err;
            }
        }
        throw error;
    }
}

export async function getUserOrders(userId) {
    return findOrdersByUser(userId);
}

export async function updateUserRole(id, role) {
    const validRoles = ['USER', 'ADMIN'];
    if (!role || !validRoles.includes(role)) {
        const err = new Error('Invalid role. Must be USER or ADMIN');
        err.status = 400;
        throw err;
    }

    const user = await findUserById(id);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
    }

    try {
        return await updateUser(id, { role });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                const err = new Error('User not found');
                err.status = 404;
                throw err;
            }
        }
        throw error;
    }
}
