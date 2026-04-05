const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Verify logged-in user
const auth = async (req, res, next) => {

  try {

    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    req.token = token;

    next();

  } catch (error) {

    res.status(401).json({ error: "Please authenticate" });

  }

};



// Verify admin
const adminAuth = async (req, res, next) => {

  try {

    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = user;
    req.token = token;

    next();

  } catch (error) {

    res.status(401).json({ error: "Invalid token" });

  }

};

module.exports = { auth, adminAuth };