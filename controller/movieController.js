
const Movie = require('./models/movieModels');


exports.getMovies = async (req, res) => {
  console.log('Solicitud recibida para obtener películas');

  try {
    const movies = await Movie.getAll();
    
    // Verificación adicional de que es un array
    if (!Array.isArray(movies)) {
      console.error('La respuesta no es un array:', movies);
      throw new Error('Formato de datos inesperado');
    }
    
    console.log('Películas obtenidas:', movies);
    res.json(movies);
  } catch (error) {
    console.error('Error en getMovies:', error);
    res.status(500).json({ 
      error: `Error al obtener las películas: ${error.message}`,
      // Solo muestra detalles en desarrollo
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};