const express = require('express');
const app = express();
const cors = require('cors');

const auth = require('./middleware/auth');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path');

app.use(express.json());
app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api', auth, sauceRoutes);

module.exports = app;
