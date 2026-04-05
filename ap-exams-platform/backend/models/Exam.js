const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  officialLink: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    default: ''
  },
  lastDate: {
    type: String
  },
  examType: {
    type: String,
    enum: ['present', 'upcoming'],
    default: 'present'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exam', examSchema);