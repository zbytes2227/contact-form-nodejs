const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const ApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { collection: "user-applications" }
);

const Application = mongoose.model("applications", ApplicationSchema);
module.exports = Application;