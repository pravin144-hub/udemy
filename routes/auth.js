const express = require('express');
const { check, body } = require('express-validator/check')

const authController = require('../controllers/auth');
const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login', [
        body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
        body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin
);

router.post(
    '/signup', [
        check('email')
        .isEmail()
        .withMessage('Please Enter a Valid Email.')
        .custom((value, { req }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('This Email is Forbidden');
            // }
            // return true;
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject(
                        'E-mail exists already, pick different one.'
                    );
                }
            })
        })
        .normalizeEmail(),
        body(
            'password',
            'Please Enter a Password with only Numbers and Alphabets and at least 5 characters.'
        )
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;