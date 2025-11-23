import express from 'express';
import {
    getAllUsersHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler,
    getMeHandler,
    updateMeHandler,
    deleteMeHandler,
    getMyOrdersHandler,
    updateUserRoleHandler
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { validateCreateUser, validateUpdateUser, validateRole } from '../middleware/userValidators.js';

const router = express.Router();

// User self-service routes (must come before /:id routes)
router.get('/me', authenticate, getMeHandler);
router.put('/me', authenticate, validateUpdateUser, updateMeHandler);
router.delete('/me', authenticate, deleteMeHandler);
router.get('/me/orders', authenticate, getMyOrdersHandler);

// Admin-only CRUD routes
router.get('/', authenticate, authorizeRoles('ADMIN'), getAllUsersHandler);
router.post('/', authenticate, authorizeRoles('ADMIN'), validateCreateUser, createUserHandler);
router.get('/:id', authenticate, authorizeRoles('ADMIN'), getUserByIdHandler);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), validateUpdateUser, updateUserByIdHandler);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteUserByIdHandler);
router.patch('/:id/role', authenticate, authorizeRoles('ADMIN'), validateRole, updateUserRoleHandler);

export default router;