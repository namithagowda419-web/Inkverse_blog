const mongoose = require('mongoose');

// Disable command buffering so queries fail fast or return fallback instead of timing out on serverless
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const connStr = process.env.MONGODB_URI;
    if (connStr) {
      const conn = await mongoose.connect(connStr, {
        serverSelectionTimeoutMS: 3000,
      });
      isConnected = true;
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
      return conn;
    }

    if (process.env.VERCEL) {
      console.warn('[MongoDB] Vercel serverless environment detected without MONGODB_URI.');
      return;
    }

    // Attempt local MongoDB connection when running on developer workstation
    const localUri = 'mongodb://127.0.0.1:27017/inkverse_blog';
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected locally to ${localUri}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Primary connection skipped/failed: ${err.message}.`);
    if (!process.env.VERCEL) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        isConnected = true;
        console.log(`[MongoDB Memory Server] Connected to in-memory instance: ${mongoUri}`);
        return conn;
      } catch (memErr) {
        console.error(`[MongoDB] Fallback error: ${memErr.message}`);
      }
    }
  }
};

module.exports = connectDB;
