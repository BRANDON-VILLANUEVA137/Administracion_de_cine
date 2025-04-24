const express = require('express');
const router = express.Router();
const movieController = require('../movieController');

router.get('/', movieController.getMovies);
// router.post('/', movieController.createMovie); // y así...

module.exports = router;
