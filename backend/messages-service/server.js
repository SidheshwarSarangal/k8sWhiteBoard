const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/messages', messageRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'messages-service' });
});

app.listen(PORT, () => {
  console.log(`Messages service running on port ${PORT}`);
});
