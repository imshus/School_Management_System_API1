const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: "School" },
  subject_name: { type: String, require: true },
  subject_codename: { type: String, require: true },

  createdAt: { type: Date, default: new Date() },
});
module.exports = mongoose.model("Subject", subjectSchema);
