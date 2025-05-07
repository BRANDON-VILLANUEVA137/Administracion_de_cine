const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/check-auth', (req, res) => {
    if (req.session && req.session.user) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });
  

router.post('/login', authController.login);

module.exports = router;
