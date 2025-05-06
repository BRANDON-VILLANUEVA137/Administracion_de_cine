const db = require('../config/db');

const User = {
  findByEmail: async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [username]);
    return rows[0];
  }
};

module.exports = User;
