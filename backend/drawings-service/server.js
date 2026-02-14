const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const drawingRoutes = require('./routes/drawings');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/drawings', drawingRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'drawings-service' });
});

app.listen(PORT, () => {
  console.log(`Drawings service running on port ${PORT}`);
});
