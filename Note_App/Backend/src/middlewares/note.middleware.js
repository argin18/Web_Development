const Joi = require("joi");

// For Note
const noteSchema = Joi.object({
  title: Joi.string().trim().max(100).required(),
  description: Joi.string().trim().max(5000).required(),
});

// For note validation
const validateNote = (req, res, next) => {
  const { error } = noteSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ message: errors });
  }
  next();
};

// For edit note
const editSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
}).min(1);

const validateEdit = (req, res, next) => {
  const { error } = editSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ message: errors });
  }
  next();
};

module.exports = { validateNote, validateEdit };
