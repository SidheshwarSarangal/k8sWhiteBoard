const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
connectDB();

app.use('/api/users', userRoutes);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', service: 'users-service' }));

app.listen(PORT, () => console.log(`Users service running on port ${PORT}`));
