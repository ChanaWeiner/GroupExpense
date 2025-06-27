import Joi from 'joi';

export const paypalPaymentSchema = Joi.object({
  debt_id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'חובה לציין מזהה חוב',
      'number.base': 'מזהה החוב חייב להיות מספר',
      'number.integer': 'מזהה החוב חייב להיות מספר שלם',
      'number.positive': 'מזהה החוב חייב להיות חיובי',
    }),

  amount: Joi.number().positive().precision(2).required()
    .messages({
      'any.required': 'יש לציין סכום',
      'number.base': 'הסכום חייב להיות מספר',
      'number.positive': 'הסכום חייב להיות חיובי',
    }),

  to_user_email: Joi.string().email().required()
    .messages({
      'any.required': 'יש לציין אימייל של המקבל',
      'string.email': 'האימייל אינו תקין',
    }),

  to_user_id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'יש לציין מזהה של המקבל',
      'number.base': 'מזהה המקבל חייב להיות מספר',
      'number.positive': 'מזהה המקבל חייב להיות חיובי',
    }),
});
