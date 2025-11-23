import express from 'express';
import {
  createAuthorHandler,
  deleteAuthorHandler,
  getAuthorByIdHandler,
  getAuthorsHandler,
  updateAuthorHandler,
} from '../controllers/authorController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { validateAuthor } from '../middleware/resourceValidators.js';

const router = express.Router();

router.get('/', getAuthorsHandler);
router.get('/:id', getAuthorByIdHandler);

router.post('/', authenticate, authorizeRoles('ADMIN'), validateAuthor, createAuthorHandler);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), validateAuthor, updateAuthorHandler);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteAuthorHandler);

export default router;
