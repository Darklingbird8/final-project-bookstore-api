import express from 'express';
import {
  createBookHandler,
  deleteBookHandler,
  getBookByIdHandler,
  getBooksHandler,
  updateBookHandler,
} from '../controllers/bookController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { validateCreateBook, validateUpdateBook } from '../middleware/resourceValidators.js';

const router = express.Router();

router.get('/', getBooksHandler);
router.get('/:id', getBookByIdHandler);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  validateCreateBook,
  createBookHandler,
);
router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  validateUpdateBook,
  updateBookHandler,
);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteBookHandler);

export default router;
