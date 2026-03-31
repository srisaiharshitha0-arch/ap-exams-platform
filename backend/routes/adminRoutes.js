const express = require('express');
const { body, validationResult } = require('express-validator');
const Exam = require('../models/Exam');
const User = require('../models/User');
const { adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// ADD EXAM
router.post('/exams', adminAuth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('officialLink').isURL().withMessage('Valid URL is required'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const exam = new Exam({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      eligibility: req.body.eligibility,
      officialLink: req.body.officialLink,
      lastDate: req.body.lastDate,
      notificationDate: req.body.notificationDate,
      examType: req.body.examType || 'present'
    });

    await exam.save();
    res.status(201).json({ message: "Exam added successfully", exam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding exam" });
  }
});

// UPDATE EXAM
router.put('/exams/:id', adminAuth, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        eligibility: req.body.eligibility,
        officialLink: req.body.officialLink,
        lastDate: req.body.lastDate,
        notificationDate: req.body.notificationDate,
        examType: req.body.examType || 'present',
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json({ message: "Exam updated successfully", exam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating exam" });
  }
});

// DELETE EXAM
router.delete('/exams/:id', adminAuth, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting exam" });
  }
});

// GET ALL USERS
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

module.exports = router;