import mongoose from "mongoose";

interface Db {
  connect: (uri: string) => Promise<typeof mongoose>;
  isConnected: () => number;
  disconnect: () => Promise<void>;
}

const db: Db = {
  connect: (uri) => {
    return mongoose.connect(uri);
  },
  isConnected: () => {
    return mongoose.connection.readyState;
  },
  disconnect: async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  },
};

db.connect = (uri) => {
  return mongoose.connect(uri);
};

db.isConnected = () => {
  return mongoose.connection.readyState;
};

db.disconnect = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
};

export default db;

/**
 * Database connection module.
 * Provides methods to connect to MongoDB and check connection status.
 */
