import { body } from 'express-validator';

export const registerValidator = [
  body('name').notEmpty().withMessage('יש להזין שם'),
  body('email').isEmail().withMessage('יש להזין אימייל תקין'),
  body('password').isLength({ min: 6 }).withMessage('הסיסמה חייבת להכיל לפחות 6 תווים'),
  body('paypal_email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('יש להזין אימייל PayPal תקין')
];

export const loginValidator = [
  body('email').isEmail().withMessage('יש להזין אימייל תקין'),
  body('password').notEmpty().withMessage('יש להזין סיסמה')
];

export const updateUserValidator = [
  body('name').notEmpty().withMessage('יש להזין שם'),
  body('paypal_email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('יש להזין אימייל PayPal תקין')
];