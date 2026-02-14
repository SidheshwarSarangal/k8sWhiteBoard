const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const roomRoutes = require('./routes/rooms');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/rooms', roomRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'rooms-service' });
});

app.listen(PORT, () => {
  console.log(`Rooms service running on port ${PORT}`);
});
