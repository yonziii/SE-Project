// controllers/competitionsController.js
const Competition = require('../models/competition');

exports.createCompetition = async (req, res, next) => {
  console.log('Received body:', req.body);
	try {
		// 1) Destructure all form fields from the JSON body
		const {
			title,
			description,
			image_url,
			eligibility,
			categories,
			scope,
			participant_type,
			min_participants,
			max_participants,
			entry_fee_type,
			fee_amount,
			organizer_name,
			website,
			start_date,
			end_date
		} = req.body;

		// 2) Basic validation
		if (!title || !description || !eligibility || !scope ||
			!participant_type || !entry_fee_type ||
			!organizer_name || !start_date || !end_date) {
			return res.status(400).json({
				message: 'Missing required fields.'
			});
		}
		if (participant_type === 'team' &&
			(!min_participants || !max_participants)) {
			return res.status(400).json({
				message: 'Team size required.'
			});
		}
		if (entry_fee_type === 'paid' && !fee_amount) {
			return res.status(400).json({
				message: 'Fee amount required.'
			});
		}

		// 3) Get the user ID
		const postedBy = req.user.sub;
		if (!postedBy) {
			return res.status(401).json({
				message: 'Unauthorized'
			});
		}

		// 4) Create the competition row
		const comp = await Competition.create({
			title,
			description,
			image_url: image_url || null,
			eligibility,
			categories: categories || null,
			scope,
			participant_type,
			min_participants: participant_type === 'team' ? min_participants : null,
			max_participants: participant_type === 'team' ? max_participants : null,
			entry_fee_type,
			fee_amount: entry_fee_type === 'paid' ? fee_amount : null,
			organizer_name,
			website: website || null,
			start_date,
			end_date,
			posted_by: postedBy,
			status: 'pending'
		});

		return res.status(201).json({
			message: 'Competition submitted for review',
			competition: comp
		});
	} catch (err) {
		next(err);
	}
};

exports.getCompetitions = async (req, res, next) => {
  try {
    const competitions = await Competition.findAll();
    res.json(competitions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load competitions' });
  }
};