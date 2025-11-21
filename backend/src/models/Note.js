const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    category: {
      type: String,
      enum: ["travail", "personnel", "urgent"],
      default: "personnel",
    },
    attachment: {
      filename: String,
      url: String,
      mimetype: String,
      size: Number,
      storedName: String,
    },
  },
  { timestamps: true }
);

noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Note", noteSchema);
