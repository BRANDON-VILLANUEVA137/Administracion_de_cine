// controllers/routes/moviesRoutes.js
const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModel');
const { ensureAuthenticated, ensureRole } = require('../middlewares/authMiddleware');

// Obtener todas las películas (accesible para usuarios logueados)
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const movies = await Movie.getAll();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener películas' });
  }
});

// Obtener una película por ID (accesible para usuarios logueados)
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const movie = await Movie.getById(req.params.id);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener película' });
  }
});

// Crear una nueva película (solo admin)
router.post('/', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  try {
    const movieId = await Movie.create(req.body);
    res.status(201).json({ id: movieId, message: 'Película creada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear película' });
  }
});

// Actualizar una película existente (solo admin)
router.put('/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  try {
    await Movie.update(req.params.id, req.body);
    res.json({ message: 'Película actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar película' });
  }
});

// Eliminar una película (solo admin)
router.delete('/:id', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
  try {
    await Movie.delete(req.params.id);
    res.json({ message: 'Película eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar película' });
  }
});

module.exports = router;
