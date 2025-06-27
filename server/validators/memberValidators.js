import Joi from 'joi';

export const groupIdParamSchema = Joi.object({
  group_id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'חסר מזהה קבוצה',
      'number.base': 'מזהה קבוצה חייב להיות מספר',
      'number.integer': 'מזהה קבוצה חייב להיות מספר שלם',
      'number.positive': 'מזהה קבוצה חייב להיות חיובי',
    }),
});

export const removeMemberParamsSchema = Joi.object({
  group_id: Joi.number().integer().positive().required(),
  id: Joi.number().integer().positive().required()
});

export const addMemberBodySchema = Joi.object({
  user_email: Joi.string().email().required()
    .messages({
      'any.required': 'יש להזין כתובת אימייל',
      'string.email': 'כתובת אימייל לא תקינה',
    }),
});
