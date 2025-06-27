import Joi from 'joi';

export const owedToMeQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
  filter: Joi.string().valid('all', 'open', 'overdue').default('all')
});
