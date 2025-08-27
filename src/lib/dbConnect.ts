import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

const cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false, maxPoolSize: 10 };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected successfully");
    return cached.conn;
  } catch (err) {
    cached.promise = null; // reset cache if failed
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

export default dbConnect;
