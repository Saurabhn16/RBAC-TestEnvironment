const express = require("express");
const mongoose = require("mongoose");
const TestPaper = require("../models/TestPaper");
const Response = require("../models/Response");  // Import Response model
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Test
router.post("/create-test", roleMiddleware("teacher"), async (req, res) => {
  const { title, questions } = req.body;

  try {
    const newTest = new TestPaper({ title, questions, createdBy: req.user.id });
    await newTest.save();
    res.status(201).json({ message: "Test created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating test", error });
  }
});

// Create Test (another endpoint, could be redundant)
router.post("/tests", async (req, res) => {
  const { testName, questions } = req.body;

  try {
    const newTest = new TestPaper({ testName, questions });
    await newTest.save();
    res.status(201).json({ message: "Test created successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Error creating test", error });
  }
});

// Get Test Responses - Fetch responses from the database
router.get("/test-responses", roleMiddleware("teacher"), async (req, res) => {
  try {
    // Fetch responses from the database
    const responses = await Response.find()
      .populate('student', 'name email')  // Populate student details (name, email)
      .populate('test', 'title')  // Populate test title
      .exec();

    if (!responses || responses.length === 0) {
      return res.status(404).json({ message: "No responses found" });
    }

    // Send the responses as the API response
    res.status(200).json(responses);
  } catch (error) {
    console.error("Error fetching test responses:", error);
    res.status(500).json({ message: "Error fetching test responses", error: error.message });
  }
});

module.exports = router;
