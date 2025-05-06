// Importaciones únicas al principio del archivo
const db = require('./config/db');
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const movieRoutes = require('./Routes/movieRoutes');

// Inicializar express
const app = express();

// Configurar dotenv
dotenv.config();

// Middleware
const cors = require('cors');

// Configuración de CORS
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://senzacine.netlify.app'], // Permitir solo el dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));

app.use(express.json());
app.use(express.static('public')); // Para servir el frontend
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(session({
  secret: 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: true,
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas (ejemplo de ruta inicial)
app.get('/', (req, res) => {
  res.send('¡Bienvenido al sistema de gestión de cine!');
});

app.use('/api/movies', movieRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀Servidor corriendo en http://localhost:${PORT}`);
});
