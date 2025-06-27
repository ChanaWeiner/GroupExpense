import Joi from 'joi';

export const groupCreationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.base': 'שם הקבוצה חייב להיות מחרוזת',
    'string.empty': 'יש לספק שם לקבוצה',
    'string.min': 'שם הקבוצה צריך להכיל לפחות 2 תווים',
    'any.required': 'יש לספק שם לקבוצה'
  })
});

export const groupUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.base': 'שם הקבוצה חייב להיות מחרוזת',
    'string.empty': 'יש לספק שם לקבוצה',
    'string.min': 'שם הקבוצה צריך להכיל לפחות 2 תווים',
    'any.required': 'יש לספק שם לקבוצה'
  })
});

export const groupIdParamSchema = Joi.object({
  groupId: Joi.number().integer().positive().required().messages({
    'number.base': 'מזהה הקבוצה חייב להיות מספר',
    'number.integer': 'מזהה הקבוצה חייב להיות מספר שלם',
    'number.positive': 'מזהה הקבוצה חייב להיות חיובי',
    'any.required': 'יש לציין מזהה קבוצה'
  }),

  id: Joi.number().integer().positive().optional(),
});