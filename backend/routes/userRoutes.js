const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();


// GET USER PROFILE
router.get('/profile', auth, async (req, res) => {

  try {

    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedExams');

    res.json(user);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Error fetching profile' });

  }

});



// UPDATE PROFILE
router.put('/profile', auth, async (req, res) => {

  try {

    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    ).select('-password');

    res.json(user);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Error updating profile' });

  }

});



// GET SAVED EXAMS
router.get('/saved-exams', auth, async (req, res) => {

  try {

    const user = await User.findById(req.user._id)
      .populate('savedExams');

    res.json(user.savedExams);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Error fetching saved exams' });

  }

});



module.exports = router;