export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.query);
      if (error) {
        console.error("שגיאת ולידציה:", error.details[0].message);
        return res.status(400).json({ message: error.details[0].message });
      }

      Object.assign(req.query, value); // התיקון החשוב כאן
      next();
    } catch (err) {
      console.error("שגיאה חריגה ב־validateQuery:", err);
      res.status(500).json({ message: 'שגיאה פנימית בולידציה' });
    }
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
