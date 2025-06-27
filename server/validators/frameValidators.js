import Joi from 'joi';

// params
export const groupIdParamSchema = Joi.object({
    group_id: Joi.number().integer().min(1).required()
});

export const frameIdParamSchema = Joi.object({
    frame_id: Joi.number().integer().min(1).required()
});

export const frameIdParamSchemaWithGroupId = Joi.object({
    frame_id: Joi.number().integer().min(1).required(),
    group_id: Joi.number().integer().min(1).required()
});

// query
export const searchQuerySchema = Joi.object({
    query: Joi.string().allow('').max(255).default('')
});

// body
export const createFrameBodySchema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().allow('').optional(),
    end_date: Joi.date().iso().optional().allow(null, '')
});

export const updateFrameBodySchema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().allow('').optional()
});
