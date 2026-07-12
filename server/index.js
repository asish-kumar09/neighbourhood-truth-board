const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const complaintsRoute = require('./routes/complaints');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/complaints', complaintsRoute);

app.get('/', (req, res) => {
  res.json({ message: 'Neighbourhood Truth Board API running!' });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: true })
  .then(() => {
    console.log('✅ Database connected and synced!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('❌ Database error:', err));