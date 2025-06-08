require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const competitionsRoutes = require('./routes/competitions');
const cors = require('cors');

const app = express();

// 1) Enable CORS (so your front-end can call the API)
app.use(cors({
  origin: true,   // allow any origin, or replace with specific URL(s)
  credentials: true
}));

// 2) Parse JSON bodies
app.use(express.json());




// 3) Authentication routes (signup / signin)
app.use('/api/auth', authRoutes);

// 4) Competition submission route
app.use('/api/competitions', competitionsRoutes);

// 5) Serve static frontend files from 'public/'
app.use(express.static(path.join(__dirname, 'public')));

// 6) Wildcard route to serve your frontend's index (if you want SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// 7) Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// 8) Sync database models and start the server
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(console.error);
// This will start the server and sync the database models.
// Make sure to handle any errors that might occur during the sync process.
