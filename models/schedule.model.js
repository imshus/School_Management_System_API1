const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: "School", required: true },
  teacher: { type: mongoose.Schema.ObjectId, ref: "Teacher", required: true },
  subject: { type: mongoose.Schema.ObjectId, ref: "Subject", required: true },
  class: { type: mongoose.Schema.ObjectId, ref: "Class", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Schedule", scheduleSchema);
