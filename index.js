// Require necessary packages and modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
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

// Set up CORS to allow requests only from the frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  })
);

// Set up helmet to secure the app
app.use(helmet());

// Set up rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Set up a logger to log errors and other events
const logger = require("morgan");
app.use(logger("dev"));

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
  console.log(`Server is running on port ${PORT}`);
});
