import Joi from 'joi';

// params
export const frameIdParamSchema = Joi.object({
  frame_id: Joi.number().integer().min(1).required()
});

export const expenseIdParamSchema = Joi.object({
  id: Joi.number().integer().min(1).required()
});

export const groupAndFrameIdParamsSchema = Joi.object({
  group_id: Joi.number().integer().min(1).required(),
  frame_id: Joi.number().integer().min(1).required()
});

// query
export const searchExpensesQuerySchema = Joi.object({
  q: Joi.string().allow('').max(255).default('')
});

// body (multipart, so handled manually)
export const createExpenseBodySchema = Joi.object({
  total_amount: Joi.number().min(0).required(),
  description: Joi.string().max(255).required(),
  items: Joi.string().required() // parsed as JSON later
});