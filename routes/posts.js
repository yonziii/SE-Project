const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPost, listPosts } = require('../controllers/postsController');

// Public feed
router.get('/', listPosts);

// Create post with attachments
router.post('/', auth, createPost);

module.exports = router;
