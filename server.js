require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const cors = require('cors');

const app = express();

app.use(cors());                     // enable CORS for all routes

app.use(express.json());             // parse JSON bodies

app.use(express.static(path.join(__dirname, 'public'))); // serve static files from 'public' directory

app.use('/api/auth', authRoutes);    // mount auth routes

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Global error handler (simplest form)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true })      // sync models to DB
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(console.error);
// This will start the server and sync the database models.
// Make sure to handle any errors that might occur during the sync process.
