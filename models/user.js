// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,       // universally unique ID
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,     // hashed password
    allowNull: false,
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.STRING), // For Postgres
    defaultValue: ['user'],
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
