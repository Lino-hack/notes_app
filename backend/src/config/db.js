const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB || "notes-app",
    });
    if (process.env.NODE_ENV !== "test") {
      // eslint-disable-next-line no-console
      console.log("🌿 MongoDB connecté !");
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Erreur MongoDB :", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
