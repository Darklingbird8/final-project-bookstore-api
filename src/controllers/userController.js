import {
    getAllUsers,
    createUserService,
    getUserById,
    updateUserById,
    deleteUserById,
    getUserOrders,
    updateUserRole,
} from '../services/userService.js';

export async function getAllUsersHandler(req, res, next) {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

export async function createUserHandler(req, res, next) {
    try {
        const { email, password, role } = req.body;
        const newUser = await createUserService({ email, password, role });
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
}

export async function getUserByIdHandler(req, res, next) {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await getUserById(userId);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export async function updateUserByIdHandler(req, res, next) {
    try {
        const userId = parseInt(req.params.id, 10);
        const { email, password } = req.body;
        const updated = await updateUserById(userId, { email, password });
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

export async function deleteUserByIdHandler(req, res, next) {
    try {
        const userId = parseInt(req.params.id, 10);
        await deleteUserById(userId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export async function getMeHandler(req, res, next) {
    try {
        const userId = req.user && req.user.id;
        const user = await getUserById(userId);
        if (!user) {
            const error = new Error('Not Found');
            error.status = 404;
            return next(error);
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export async function updateMeHandler(req, res, next) {
    try {
        const userId = req.user && req.user.id;
        const { email, password } = req.body;
        const updated = await updateUserById(userId, { email, password });
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

export async function deleteMeHandler(req, res, next) {
    try {
        const userId = req.user && req.user.id;
        await deleteUserById(userId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export async function getMyOrdersHandler(req, res, next) {
    try {
        const userId = req.user && req.user.id;
        const orders = await getUserOrders(userId);
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
}

export async function updateUserRoleHandler(req, res, next) {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const updated = await updateUserRole(Number(id), role);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}