const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  User.findUserByUsername(username, async (err, results) => {
    if (err) {
      console.error('Error en el servidor:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    req.session.userId = user.id;
    res.json({ message: 'Login exitoso', userId: user.id });
  });
};

module.exports = {
  login
};
