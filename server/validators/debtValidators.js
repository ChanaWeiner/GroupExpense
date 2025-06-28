import Joi from 'joi';

export const owedToMeQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'מספר עמוד חייב להיות מספר',
      'number.min': 'מספר עמוד חייב להיות לפחות 1'
    }),
  pageSize: Joi.number().integer().min(1).max(100).default(10)
    .messages({
      'number.base': 'גודל עמוד חייב להיות מספר',
      'number.min': 'גודל עמוד חייב להיות לפחות 1',
      'number.max': 'גודל עמוד לא יכול להיות גדול מ-100'
    }),
  filter: Joi.string().valid('all', '7days', '14days').default('all')
    .messages({
      'any.only': 'סינון חייב להיות אחד מהערכים: all, open, overdue'
    })    
});