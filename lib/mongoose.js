import mongoose from "mongoose";
let cachedDb = null;

export const mongooseConnect = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedDb = db;
  return db;
};
