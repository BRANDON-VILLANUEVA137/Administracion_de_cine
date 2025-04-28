// controllers/movieController.js
const movieModel = require('../models/movieModel');

// Listar todas las películas
exports.getAllMovies = (req, res) => {
  movieModel.getAll((err, movies) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener películas' });
    }
    res.json(movies);
  });
};
