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

// Obtener películas por estado
exports.obtenerPorEstado = async (req, res) => {
  const { estado } = req.params;
  try {
    const peliculas = await movieModel.getByEstado(estado);
    console.log(peliculas);  // Verifica que se devuelven datos válidos

    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener películas por estado' });
  }
};