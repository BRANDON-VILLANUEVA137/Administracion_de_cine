// models/Movie.js
const db = require('../config/db');

const Movie = {
  // Obtener todas las películas
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM movies');
    return rows;
  },


  
  // Obtener una sola película
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [id]);
    return rows[0];
  },

  // Crear nueva película
  create: async (movie) => {
    const { title, description, duration, rating, genre, trailer_url, image_url } = movie;
    const [result] = await db.query(
      'INSERT INTO movies (title, description, duration, rating, genre, trailer_url, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, duration, rating, genre, trailer_url, image_url]
    );
    return result.insertId;
  },

  // Actualizar película
  update: async (id, movie) => {
    const { title, description, duration, rating, genre, trailer_url, image_url, estado } = movie;
    await db.query(
      'UPDATE movies SET title = ?, description = ?, estado = ?,duration = ?, rating = ?, genre = ?, trailer_url = ?, image_url = ?, estado = ? WHERE id = ?',
      [title, description, duration, rating, genre, trailer_url, image_url, estado, id]
    );
  },

  // Eliminar película
  delete: async (id) => {
    await db.query('DELETE FROM movies WHERE id = ?', [id]);
  },

  getByEstado: async (estado) => {
    const [rows] = await db.query('SELECT * FROM movies WHERE estado = ?', [estado]);
    return rows;
  }

};



module.exports = Movie;
