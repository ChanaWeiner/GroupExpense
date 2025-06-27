export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    if (error) return res.status(400).json({ message: error.details[0].message });
    req.query = value;
    next();
  };
};

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    req.body = value;
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    req.params = value;
    next();
  };
};
