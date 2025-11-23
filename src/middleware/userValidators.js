import { handleValidationErrors } from "./handleValidationErrors.js";
import { body } from "express-validator";

export const validateUser = [
    body('email')
    .exists({ values: 'false' })
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('email is not valid')
    .normalizeEmail(),

    body('password')
    .exists({ values: 'false' })
    .withMessage('password is required')
    .bail()
    .isLength({min: 8, max: 64})
    .withMessage('password must be contain at least 8 and at most 64 characters'),

    handleValidationErrors,
]

export const validateRole = [
    body('role')
        .exists()
        .withMessage('Role is required')
        .isIn(['USER', 'ADMIN'])
        .withMessage('Role must be USER or ADMIN'),
    handleValidationErrors,
];

export const validateCreateUser = [
    body('email')
        .exists({ values: 'false' })
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('email is not valid')
        .normalizeEmail(),

    body('password')
        .exists({ values: 'false' })
        .withMessage('password is required')
        .bail()
        .isLength({min: 8, max: 64})
        .withMessage('password must be contain at least 8 and at most 64 characters'),

    body('role')
        .optional()
        .isIn(['USER', 'ADMIN'])
        .withMessage('Role must be USER or ADMIN'),

    handleValidationErrors,
];

export const validateUpdateUser = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('email is not valid')
        .normalizeEmail(),

    body('password')
        .optional()
        .isLength({ min: 8, max: 64 })
        .withMessage('password must contain at least 8 and at most 64 characters'),

    body().custom(async (value, { req }) => {
        if (!req.body.email && !req.body.password) {
            throw new Error('At least one of email or password must be provided');
        }
        return true;
    }),

    handleValidationErrors,
];