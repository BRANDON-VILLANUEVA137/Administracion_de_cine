// Importaciones
const db = require('./config/db');
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const movieRoutes = require('./Routes/movieRoutes');
const authRoutes = require('./Routes/authRoutes');

const app = express();
dotenv.config();

// Middleware: CORS
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'https://senzacine.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight

// Sesiones
app.use(express.json());

app.use(session({
  secret: 'cine_session_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
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