// Importaciones
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const db = require('./config/db');
const movieRoutes = require('./Routes/movieRoutes');
const authRoutes = require('./Routes/authRoutes');

// Inicializar express
const app = express();

// Configurar dotenv
dotenv.config();

// Middleware
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://senzacine.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // <-- ESTO ES CLAVE
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (HTML, CSS, JS del frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones
app.use(session({
  secret: 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,           // true si Railway usa HTTPS
    sameSite: 'none'        // necesario para cookies en CORS
  }
}));

// Ruta para servir login.html directamente desde /views
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Rutas
app.use('/api/movies', movieRoutes);
app.use(authRoutes); // Aquí se maneja POST /login
app.use('/auth', authRoutes);


// Ruta raíz opcional
app.get('/', (req, res) => {
  res.send('¡Bienvenido al sistema de gestión de cine!');
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
