const db = require('../config/db');

const findUserByUsername = (username, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [username], callback);
};

module.exports = {
  findUserByUsername
};
