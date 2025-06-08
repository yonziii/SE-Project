const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role'); // if you want only admins

const { createCompetition, getCompetitions, getCompetitionById, updateCompetitionStatus} = require('../controllers/competitionsController');

// POST /api/competitions
router.post('/', auth, createCompetition);

// GET /api/competitions
router.get('/', getCompetitions);
// This code sets up the competition routes for creating and retrieving competitions.
// It uses the competitionsController to handle the logic for these routes.
router.get('/:id', getCompetitionById);

router.patch('/:id/status', auth, /* role('admin'), */ updateCompetitionStatus);

module.exports = router;

