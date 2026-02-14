const { body, validationResult } = require('express-validator');

const validateDrawingSave = [
  body('roomId').isString().notEmpty().withMessage('roomId is required'),
  body('strokeData').isObject().notEmpty().withMessage('strokeData must be a valid object'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateDrawingSave };
