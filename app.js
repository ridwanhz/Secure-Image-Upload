const express = require('express');
const app = express();
const sequelize = require('./app/config/db');
const authRoutes = require('./app/routes/auth');
const imageRoutes = require('./app/routes/image');
require('dotenv').config();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/image', imageRoutes);

//Test Route
app.get('/', (req, res) => {
    res.send('Secure Image Upload API');
});

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
  
// Sync DB and start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(3000, '0.0.0.0', () => {
        console.log(`Secure Image Upload Application started`);
      });
}).catch(err => console.error('Database Connection Failed:', err));