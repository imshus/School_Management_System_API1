const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: "School" },
  email: { type: String, require: true },
  name: { type: String, require: true },
  qualification: { type: String, require: true },
  age: { type: String, require: true },
  gender: { type: String, require: true },
  teacher_image: { type: String, require: true },
  password: { type: String, require: true },

  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Teacher", teacherSchema);
