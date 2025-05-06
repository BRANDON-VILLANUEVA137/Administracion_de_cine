// controller/authController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.login = async (req, res) => {
  console.log('Datos recibidos en login:', req.body); // <-- Agrega esto

  const { email, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Enviar solo el rol
    res.status(200).json({ role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
