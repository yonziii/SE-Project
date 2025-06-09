const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signup = async (req, res, next) => {
  try {
    const { email, password, roles } = req.body;
    if (!email || !password || !roles) {
    return res.status(400).json({ message: 'All fields are required' });
    }
    // 1) Check if user already exists
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email taken' });

    // 2) Hash password
    const hashed = await bcrypt.hash(password, 12);

    // 3) Create user
    const user = await User.create({ email, password: hashed, roles: ['user'] });

    res.status(201).json({ id: user.id, email: user.email, roles: user.roles });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1) Find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // 2) Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    // 3) Sign JWT
    const token = jwt.sign(
      { sub: user.id, roles: user.roles, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, signin };
// This code provides the signup and signin functionality for user authentication.
// It includes error handling and uses bcrypt for password hashing and JWT for token generation.
