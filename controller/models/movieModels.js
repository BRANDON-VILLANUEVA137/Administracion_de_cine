const db = require('../../config/db');

const Movie = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT id, title, synopsis, duration, classification, genre_id, trailer_url, image_url, release_date, is_active, created_at, updated_at FROM movies', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM movies WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  create: (movie) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO movies SET ?', [movie], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  update: (id, movie) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE movies SET ? WHERE id = ?', [movie, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM movies WHERE id = ?', [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};

module.exports = Movie;
