const express = require('express');
const scheduler = require('node-cron');
const path = require('path');
const connectDB = require('./config/db');
const { fetchandDeleteData } = require('./services/fileCleaner');
require('dotenv').config();

const PORT = process.env.PORT || 1138;
const app = express();
connectDB();

// Checks every file at midnight and Deletes all files which are older than 24 hours
scheduler.schedule('00 12 * * *', () => fetchandDeleteData());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, 'public')
    });
});

app.use('/api/files', require('./routes/files'));
app.use('/api/pages', require('./routes/pages'));

app.use((req, res, next) => {
    if (req.path === '*') {
      return res.status(404).sendFile('404.html', {
        root: path.join(__dirname, 'public')
      });
    }
    next();
  });
app.listen(PORT, () => {
    console.log('Server is Running');
});

