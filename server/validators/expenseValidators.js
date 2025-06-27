import Joi from 'joi';

// params
export const frameIdParamSchema = Joi.object({
  frame_id: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'מספר מסגרת חייב להיות מספר',
      'number.min': 'מספר מסגרת חייב להיות לפחות 1',
      'any.required': 'חובה לציין מזהה מסגרת'
    })
});

export const expenseIdParamSchema = Joi.object({
  id: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'מספר הוצאה חייב להיות מספר',
      'number.min': 'מספר הוצאה חייב להיות לפחות 1',
      'any.required': 'חובה לציין מזהה הוצאה'
    })
});

export const groupAndFrameIdParamsSchema = Joi.object({
  group_id: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'מספר קבוצה חייב להיות מספר',
      'number.min': 'מספר קבוצה חייב להיות לפחות 1',
      'any.required': 'חובה לציין מזהה קבוצה'
    }),
  frame_id: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'מספר מסגרת חייב להיות מספר',
      'number.min': 'מספר מסגרת חייב להיות לפחות 1',
      'any.required': 'חובה לציין מזהה מסגרת'
    })
});

// query
export const searchExpensesQuerySchema = Joi.object({
  q: Joi.string().allow('').max(255).default('')
    .messages({
      'string.max': 'החיפוש לא יכול להיות ארוך מ-255 תווים'
    })
});

// body (multipart, so handled manually)
export const createExpenseBodySchema = Joi.object({
  total_amount: Joi.number().min(0).required()
    .messages({
      'number.base': 'סכום חייב להיות מספר',
      'number.min': 'סכום חייב להיות לפחות 0',
      'any.required': 'חובה להזין סכום'
    }),
  description: Joi.string().max(255).required()
    .messages({
      'string.base': 'תיאור חייב להיות טקסט',
      'string.max': 'תיאור לא יכול להיות ארוך מ-255 תווים',
      'any.required': 'חובה להזין תיאור'
    }),
  items: Joi.string().required()
    .messages({
      'string.base': 'רשימת פריטים חייבת להיות טקסט',
      'any.required': 'חובה לציין פריטים'
    })
});