// seedData.js (run this file once to populate initial data)
const mongoose = require('mongoose');
const Exam = require('./models/Exam');
require('dotenv').config();

const sampleExams = [
  {
    title: "APPSC Group 1",
    description: "Andhra Pradesh Public Service Commission Group 1 Services recruitment for various administrative positions",
    officialLink: "https://psc.ap.gov.in",
    category: "APPSC",
    eligibility: "Bachelor's degree from recognized university"
  },
  {
    title: "APPSC Group 2",
    description: "Group 2 Services examination for executive posts in various departments",
    officialLink: "https://psc.ap.gov.in",
    category: "APPSC",
    eligibility: "Bachelor's degree from recognized university"
  },
  {
    title: "AP Police Recruitment",
    description: "Recruitment for SI, Constable and other posts in Andhra Pradesh Police Department",
    officialLink: "https://appolice.gov.in",
    category: "Police",
    eligibility: "10th/12th pass for Constable, Graduate for SI"
  },
  {
    title: "AP DSC Teacher Recruitment",
    description: "District Selection Committee teacher recruitment for government schools",
    officialLink: "https://apdsc.apcfss.in",
    category: "Education",
    eligibility: "B.Ed with relevant subject qualification"
  },
  {
    title: "AP Grama Sachivalayam",
    description: "Village/Ward Secretariat recruitment for various posts",
    officialLink: "https://gramasachivalayam.ap.gov.in",
    category: "Sachivalayam",
    eligibility: "10th/Intermediate/Degree based on post"
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ap-exams-platform')
  .then(async () => {
    console.log('Connected to MongoDB');
    await Exam.deleteMany({});
    await Exam.insertMany(sampleExams);
    console.log('Sample exams added successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });