const { body, validationResult } = require('express-validator');

const validateRoomCreation = [
  body('roomId').isString().notEmpty().withMessage('roomId is required'),
  body('name').optional().isString(),
  body('isPrivate').isBoolean().withMessage('isPrivate must be boolean'),
  body('owner').isString().notEmpty().withMessage('owner is required'),
  body('description').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateRoomCreation };
