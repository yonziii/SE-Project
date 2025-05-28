const express = require('express');
const { signup, signin } = require('../controllers/authController');
const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/signin
router.post('/signin', signin);

module.exports = router;
// This code sets up the authentication routes for user signup and signin.
// It uses the authController to handle the logic for these routes. 