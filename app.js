// Importaciones únicas al principio del archivo
const db = require('./config/db');
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const movieRoutes = require('./Routes/movieRoutes');
const authRoutes = require('./Routes/authRoutes');

// Inicializar express
const app = express();

// Configurar dotenv
dotenv.config();

// Middleware
const cors = require('cors');

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'https://senzacine.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(session({
  secret: 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // usa true si estás en HTTPS
    sameSite: 'lax'
  }
}));


// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas (ejemplo de ruta inicial)
app.get('/', (req, res) => {
  res.send('¡Bienvenido al sistema de gestión de cine!');
});

app.use('/api/movies', movieRoutes);
app.use('/auth', authRoutes);


// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀Servidor corriendo en http://localhost:${PORT}`);
});
