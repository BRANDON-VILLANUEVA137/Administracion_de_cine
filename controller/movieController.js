const Movie = require('../controller/models/movieModels');

exports.getMovies = async (req, res) => {
  try {
    const [movies] = await Movie.getAll();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las películas' });
  }
};
