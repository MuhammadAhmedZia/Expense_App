const Joi = require('joi');

const flash = require('connect-flash')

const signupSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Enter a valid email',
        'string.empty': 'Email is required'
    }),
    password: Joi.string().min(4).required().messages({
        'string.min': 'Password must be at least 4 characters',
        'string.empty': 'Password is required'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Enter a valid email',
        'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required'
    })
});

module.exports = { signupSchema, loginSchema };
