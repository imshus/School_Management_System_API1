const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  school_name: { type: String, require: true },
  email: { type: String, require: true },
  owner_name: { type: String, require: true },
  school_image: { type: String, require: true },
  password: { type: String, require: true },

  createdAt: { type: Date, default: new Date() },
});
module.exports = mongoose.model("School", schoolSchema);
