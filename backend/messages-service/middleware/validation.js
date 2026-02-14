const { body, validationResult } = require('express-validator');

const validateMessage = [
  body('roomId').isString().notEmpty().withMessage('roomId is required'),
  body('sender').isString().notEmpty().withMessage('sender is required'),
  body('text').isString().notEmpty().withMessage('text is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateMessage };
