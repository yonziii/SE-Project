// models/competition.js
const {
	DataTypes
} = require('sequelize');
const sequelize = require('../config/db');

const Competition = sequelize.define('Competition', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	image_url: {
		type: DataTypes.STRING,
		allowNull: false
	},
	eligibility: {
		type: DataTypes.ENUM('general', 'school', 'university'),
		allowNull: false
	},
	categories: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		allowNull: true
	},
	scope: {
		type: DataTypes.ENUM('regional', 'national', 'international'),
		allowNull: false
	},
	participant_type: {
		type: DataTypes.ENUM('individual', 'team'),
		allowNull: false
	},
	min_participants: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	max_participants: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	entry_fee_type: {
		type: DataTypes.ENUM('free', 'paid'),
		allowNull: false
	},
	fee_amount: {
		type: DataTypes.INTEGER,
		allowNull: true
	},
	organizer_name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	website: {
		type: DataTypes.STRING,
		allowNull: true
	},
	start_date: {
		type: DataTypes.DATE,
		allowNull: false
	},
	end_date: {
		type: DataTypes.DATE,
		allowNull: false
	},
	posted_by: {
		type: DataTypes.UUID,
		allowNull: false
	},
	status: {
		type: DataTypes.ENUM('pending', 'active', 'rejected', 'completed'),
		defaultValue: 'pending'
	},
	reviewed_at: {
		type: DataTypes.DATE,
		allowNull: true
	},
	reviewed_by: {
		type: DataTypes.UUID,
		allowNull: true
	},
}, {
	tableName: 'competitions',
	timestamps: true
});

module.exports = Competition;