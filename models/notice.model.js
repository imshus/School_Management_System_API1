const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: "School" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  audience: { type: String, enum: ["Student", "Teacher"] },

  createAt: { type: Date, default: new Date() },
});
module.exports = new mongoose.model("Notice", noticeSchema);
