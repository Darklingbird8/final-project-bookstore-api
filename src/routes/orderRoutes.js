import express from 'express';
import {
  createOrderHandler,
  deleteOrderHandler,
  getAllOrdersHandler,
  getMyOrdersHandler,
  getOrderByIdHandler,
  updateOrderStatusHandler,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { validateCreateOrder, validateOrderStatus } from '../middleware/resourceValidators.js';

const router = express.Router();

router.post('/', authenticate, validateCreateOrder, createOrderHandler);
router.get('/', authenticate, getMyOrdersHandler);

router.get('/all', authenticate, authorizeRoles('ADMIN'), getAllOrdersHandler);
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN'),
  validateOrderStatus,
  updateOrderStatusHandler,
);

router.get('/:id', authenticate, getOrderByIdHandler);
router.delete('/:id', authenticate, deleteOrderHandler);

export default router;
