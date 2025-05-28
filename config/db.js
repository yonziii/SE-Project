// config/db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect:  'postgres',
  protocol: 'postgres',
  logging:  false,      // turn on (true) if you want to see SQL in the console
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false  // for many hosted Postgres instances
    }
  }
});

module.exports = sequelize;
