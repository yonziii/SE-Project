const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createCompetition, getCompetitions } = require('../controllers/competitionsController');

// POST /api/competitions
router.post('/', auth, createCompetition);

// GET /api/competitions
router.get('/', getCompetitions);
// This code sets up the competition routes for creating and retrieving competitions.
// It uses the competitionsController to handle the logic for these routes.

module.exports = router;

