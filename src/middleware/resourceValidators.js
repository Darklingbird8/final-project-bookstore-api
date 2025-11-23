import { body } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateAuthor = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  handleValidationErrors,
];

export const validateCreateBook = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('price')
    .exists({ checkFalsy: true })
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number')
    .toFloat(),
  body('stock')
    .exists({ checkFalsy: true })
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be zero or greater')
    .toInt(),
  body('authorId')
    .exists({ checkFalsy: true })
    .withMessage('authorId is required')
    .isInt({ gt: 0 })
    .withMessage('authorId must be a positive integer')
    .toInt(),
  handleValidationErrors,
];

export const validateUpdateBook = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be positive').toFloat(),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be zero or greater').toInt(),
  body('authorId')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('authorId must be a positive integer')
    .toInt(),
  handleValidationErrors,
];

export const validateCreateOrder = [
  body('order_items')
    .isArray({ min: 1 })
    .withMessage('order_items must be a non-empty array'),
  body('order_items.*')
    .custom((value) => {
      const bookId = value.bookId ?? value.book_id;
      if (!bookId || Number.isNaN(Number(bookId))) {
        throw new Error('Each order item must include book_id');
      }
      if (!value.quantity || Number.isNaN(Number(value.quantity)) || Number(value.quantity) <= 0) {
        throw new Error('Each order item must include quantity > 0');
      }
      return true;
    }),
  handleValidationErrors,
];

export const validateOrderStatus = [
  body('status').exists({ checkFalsy: true }).withMessage('Status is required'),
  handleValidationErrors,
];
