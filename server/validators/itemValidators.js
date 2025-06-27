// validators/shoppingItemValidators.js
import Joi from 'joi';

export const frameIdParamSchema = Joi.object({
  frame_id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'חסר מזהה מסגרת',
      'number.base': 'מזהה מסגרת חייב להיות מספר',
      'number.integer': 'מזהה מסגרת חייב להיות מספר שלם',
      'number.positive': 'מזהה מסגרת חייב להיות חיובי'
    })
});

export const itemIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'חסר מזהה פריט',
      'number.base': 'מזהה פריט חייב להיות מספר',
      'number.integer': 'מזהה פריט חייב להיות מספר שלם',
      'number.positive': 'מזהה פריט חייב להיות חיובי'
    })
});

export const createItemSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    'string.empty': 'חסר שם לפריט',
    'any.required': 'חסר שם לפריט'
  }),
  note: Joi.string().allow('').optional()
});

export const updateItemSchema = Joi.object({
  name: Joi.string().min(1).messages({
    'string.empty': 'שם הפריט לא יכול להיות ריק'
  }),
  note: Joi.string().allow('').optional(),
  purchased: Joi.boolean().optional(),
  purchased_by: Joi.number().integer().positive().optional()
}).min(1).messages({
  'object.min': 'יש לספק לפחות שדה אחד לעדכון'
});
