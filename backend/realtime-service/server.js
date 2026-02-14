const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
require('dotenv').config();

const setupSocket = require('./socket/socketManager');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'realtime-service' });
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

async function initRedisAdapter() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.log('No REDIS_URL set; using in-memory adapter (single replica only).');
    return;
  }
  try {
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log('Redis adapter attached for multi-replica Socket.IO.');
  } catch (err) {
    console.warn('Redis adapter failed, using in-memory:', err.message);
  }
}

initRedisAdapter().then(() => {
  setupSocket(io);

  server.listen(PORT, () => {
    console.log(`Realtime service running on port ${PORT}`);
  });
});
