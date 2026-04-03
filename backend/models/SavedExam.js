const mongoose = require('mongoose');

const savedExamSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't save the same exam twice
savedExamSchema.index({ userId: 1, examId: 1 }, { unique: true });

module.exports = mongoose.model('SavedExam', savedExamSchema);
