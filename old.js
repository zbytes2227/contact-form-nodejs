// Require necessary packages and modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Application = require("./models/Applications.model");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3030;

require("dotenv").config();

// Connect to MongoDB database
mongoose.connect(process.env.DB_KEY).then(() => {
  console.log("MongoDB connected successfully");
});

app.use(bodyParser.json());
app.use(cors()); // enable CORS for all routes

app.get("/", async (req, res) => {
  res.send("Hello");
});

app.post("/api/new/application", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate name
    if (!name) {
      return res.status(400).json({ status: "Error", msg: "Name is required" });
    }
    if (name.length > 50) {
      return res.status(400).json({
        status: "Error",
        msg: "Name should not be longer than 50 characters",
      });
    }

    // Validate email
    if (!email) {
      return res
        .status(400)
        .json({ status: "Error", msg: "Email is required" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ status: "Error", msg: "Email is invalid" });
    }

    // Validate message length
    if (!message) {
      return res
        .status(400)
        .json({ status: "Error", msg: "Message is required" });
    }
    if (message.length > 50000) {
      return res.status(400).json({
        status: "Error",
        msg: "Message should not be longer than 50000 characters",
      });
    }

    if (message.length < 10) {
      return res.status(400).json({
        status: "Error",
        msg: "Message should have minimum 10 characters",
      });
    }

    // Prevent SQL injection attacks
    const cleanName = name.replace(/'/g, "''");
    const cleanEmail = email.replace(/'/g, "''");
    const cleanMessage = message.replace(/'/g, "''");

    // Create new application
    const newApplication = await Application.create({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });

    // console.log(newApplication);
    res.json({ status: "Success", msg: "Submit Successful" });
  } catch (error) {
    res.status(500).json({ status: "Error", msg: error.message });
    console.log(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log("Server status : Running👍🏻", PORT);
});
