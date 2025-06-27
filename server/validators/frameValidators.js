import Joi from 'joi';

// params
export const groupIdParamSchema = Joi.object({
    group_id: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'מספר קבוצה חייב להיות מספר',
            'number.min': 'מספר קבוצה חייב להיות לפחות 1',
            'any.required': 'חובה לציין מזהה קבוצה'
        })
});

export const frameIdParamSchema = Joi.object({
    frame_id: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'מספר מסגרת חייב להיות מספר',
            'number.min': 'מספר מסגרת חייב להיות לפחות 1',
            'any.required': 'חובה לציין מזהה מסגרת'
        })
});

export const frameIdParamSchemaWithGroupId = Joi.object({
    frame_id: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'מספר מסגרת חייב להיות מספר',
            'number.min': 'מספר מסגרת חייב להיות לפחות 1',
            'any.required': 'חובה לציין מזהה מסגרת'
        }),
    group_id: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'מספר קבוצה חייב להיות מספר',
            'number.min': 'מספר קבוצה חייב להיות לפחות 1',
            'any.required': 'חובה לציין מזהה קבוצה'
        })
});

// query
export const searchQuerySchema = Joi.object({
    query: Joi.string().allow('').max(255).default('')
        .messages({
            'string.max': 'החיפוש לא יכול להיות ארוך מ-255 תווים'
        })
});

// body
export const createFrameBodySchema = Joi.object({
    name: Joi.string().max(255).required()
        .messages({
            'string.base': 'שם המסגרת חייב להיות טקסט',
            'string.max': 'שם המסגרת לא יכול להיות ארוך מ-255 תווים',
            'any.required': 'חובה להזין שם מסגרת'
        }),
    description: Joi.string().allow('').optional()
        .messages({
            'string.base': 'תיאור חייב להיות טקסט'
        }),
    end_date: Joi.date().iso().optional().allow(null, '')
        .messages({
            'date.base': 'תאריך סיום חייב להיות תאריך תקין',
            'date.format': 'תאריך סיום חייב להיות בפורמט ISO'
        })
});

export const updateFrameBodySchema = Joi.object({
    name: Joi.string().max(255).required()
        .messages({
            'string.base': 'שם המסגרת חייב להיות טקסט',
            'string.max': 'שם המסגרת לא יכול להיות ארוך מ-255 תווים',
            'any.required': 'חובה להזין שם מסגרת'
        }),
    description: Joi.string().allow('').optional()
        .messages({
            'string.base': 'תיאור חייב להיות טקסט'
        })
});