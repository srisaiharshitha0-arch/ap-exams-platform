const express = require('express');
const mongoose = require('mongoose');
const Exam = require('../models/Exam');
const User = require('../models/User');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();


// GET ALL EXAMS (Public)
router.get('/', async (req, res) => {

  try {

    const exams = await Exam.find().sort({ createdAt: -1 });

    res.json(exams);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error fetching exams" });

  }

});



// GET SINGLE EXAM
router.get('/:id', async (req, res) => {

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid exam ID" });
    }

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json(exam);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error fetching exam" });

  }

});



// SAVE EXAM
router.post('/:id/save', auth, async (req, res) => {

  try {

    const examId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ error: "Invalid exam ID" });
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedExams: examId } },
      { new: true }
    ).populate('savedExams');

    res.json({
      message: "Exam saved successfully",
      savedExams: user.savedExams
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error saving exam" });

  }

});



// REMOVE SAVED EXAM
router.delete('/:id/save', auth, async (req, res) => {

  try {

    const examId = req.params.id;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedExams: examId } },
      { new: true }
    ).populate('savedExams');

    res.json({
      message: "Exam removed from saved list",
      savedExams: user.savedExams
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error removing saved exam" });

  }

});

module.exports = router;