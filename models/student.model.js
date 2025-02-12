const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: "School" },
  email: { type: String, require: true },
  name: { type: String, require: true },
  student_class: { type: String, require: true },
  age: { type: String, require: true },
  gender: { type: String, require: true },
  guardian: { type: String, require: true },
  guardian_phone: { type: String, require: true },
  student_image: { type: String, reuqire: true },
  password: { type: String, require: true },

  createAt: { type: Date, default: new Date() },
});
module.exports = mongoose.model("Student", studentSchema);
