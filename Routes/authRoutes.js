const express = require('express');
const path = require('path'); // Importa el módulo path
const router = express.Router();
const authController = require('../controller/authController');

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/Login.html')); // o usa render si usas plantillas
});

router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
