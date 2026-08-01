const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maroon_blog';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Local connection failed: ${err.message}. Starting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[MongoDB Memory Server] Connected successfully to in-memory instance: ${mongoUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB] Fallback error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
