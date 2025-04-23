require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 8080; // Railway usa 8080 por defecto

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'https://senzacine.netlify.app'
];

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // Necesario para Railway
  }
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Basic route
app.get('/', (req, res) => {
  res.send('Cine Management System API');
});

// Ruta para obtener las películas
app.get('/api/movies', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies');

    if (rows.length === 0) {
      return res.status(200).json([]);  // Retorna un arreglo vacío si no hay películas
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Error al obtener películas' });
  }
});

// Authentication routes
app.post('/api/login', async (req, res) => {
  // Login logic here
});

// SOLO UNA app.listen aquí
pool.getConnection()
  .then(conn => {
    console.log('✅ Conexión a la base de datos exitosa');
    conn.release();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });
