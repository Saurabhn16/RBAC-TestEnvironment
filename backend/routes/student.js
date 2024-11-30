const express = require("express");
const TestPaper = require("../models/TestPaper");
const Response = require("../models/Response");
const Student = require("../models/User");
const jwt = require("jsonwebtoken");
const roleMiddleware = require("../middleware/roleMiddleware");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Fetch all tests
router.get("/tests", authenticateToken, roleMiddleware("student"), async (req, res) => {
  try {
    const tests = await TestPaper.find();
    if (!tests.length) {
      return res.status(404).json({ message: "No tests found" });
    }
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tests", error: err.message });
  }
});
router.get('/responses/:testId', authenticateToken, async (req, res) => {
  try {
    const response = await Response.findOne({
      student: req.user.id,
      test: req.params.testId
    });

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    res.json(response);  // Respond with the student's response and score
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/responses', authenticateToken, async (req, res) => {
  try {
    // Get the student ID from the decoded token
    const studentId = req.user.id;  // Assuming the student ID is stored in the JWT token
    
    // Fetch all responses for the student
    const responses = await Response.find({ student: studentId })
      .populate('test', 'title')  // Populate test title from TestPaper
      .exec();

    if (!responses || responses.length === 0) {
      return res.status(404).json({ message: 'No responses found for the student' });
    }

    // Respond with the list of responses
    res.json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching responses', error: err.message });
  }
});
// Fetch test by ID
router.get("/tests/:id", authenticateToken, async (req, res) => {
  try {
    const test = await TestPaper.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Fetch student details
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student data", error: err.message });
  }
});

// Submit test
router.post("/submit/:testId", authenticateToken, roleMiddleware("student"), async (req, res) => {
  const { answers } = req.body;

  try {
    const test = await TestPaper.findById(req.params.testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const score = test.questions.reduce(
      (acc, question, index) => acc + (question.answer === answers[index] ? 1 : 0),
      0
    );

    const response = new Response({ student: req.user.id, test: req.params.testId, answers, score });
    await response.save();

    res.json({ message: "Test submitted successfully", score });
  } catch (err) {
    res.status(500).json({ message: "Error submitting test", error: err.message });
  }
});router.get('/student/:id', authenticateToken, async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});router.get('/student/tests', authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized. Please log in again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;  // Assuming the student ID is stored in the JWT token

    // Fetch all tests attempted by the student along with the result (score)
    const responses = await Response.find({ student: studentId })
      .populate('test', 'title')  // Populate test title from TestPaper
      .exec();

    const testsWithResults = responses.map(response => ({
      test: response.test,
      result: response.score,  // The score/result of the student for this test
    }));

    res.json(testsWithResults);  // Return all the tests attempted by the student with their results
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tests. Please try again later.' });
  }
});

module.exports = router;
