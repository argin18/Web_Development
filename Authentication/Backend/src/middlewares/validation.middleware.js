const Joi = require("joi");

// For register
const registerSchema = Joi.object({
  fullname: Joi.string().trim().min(6).max(25).required(),
  username: Joi.string().min(5).max(25).trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).required(),
});

const validationRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body,{
    allowUnknown:true
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// For Login
const loginSchema = Joi.object({
  username: Joi.string().optional().trim(),
  email: Joi.string().email().optional().trim(),
  password: Joi.string().min(8).required(),
});
const validationLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validationRegister, validationLogin };
