exports.getMovies = async (req, res) => {
  console.log('Solicitud recibida para obtener películas'); // Agrega este log

  try {
    const movies = await Movie.getAll(); // <--- sin destructuring
    console.log('Películas obtenidas:', movies);
    res.json(movies);
  } catch (error) {
    console.error('Error en getMovies:', error); // Aquí puedes ver el error real
    res.status(500).json({ error: `Error al obtener las películas: ${error.message}` });
  }
};
