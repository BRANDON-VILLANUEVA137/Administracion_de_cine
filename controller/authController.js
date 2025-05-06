const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).send('Usuario no encontrado');

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Contraseña incorrecta');

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Redirigir según rol
    let redirectUrl = '';

    switch (user.role) {
      case 'admin':
        redirectUrl = 'https://senzacine.netlify.app/views/Admin/Home';
        break;
      case 'cajero':
        redirectUrl = 'https://senzacine.netlify.app/views/Admin/Home';
        break;
      case 'cliente':
        redirectUrl = 'https://senzacine.netlify.app/views/Admin/Home';
        break;
    }

    res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
};
