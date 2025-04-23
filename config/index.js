require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Servir imágenes de la carpeta public/img
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Orígenes permitidos
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'https://senzacine.netlify.app'
];

// Conexión a la base de datos
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
    rejectUnauthorized: false
  }
});

// Middlewares
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Cine Management System API');
});

// Obtener películas
app.get('/api/movies', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies');
    res.json(rows.length > 0 ? rows : []);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Error al obtener películas' });
  }
});


// 💾 Configuración de subida de archivos (multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/img'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Ruta para crear películas (con imagen)
app.post('/api/movies', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      synopsis,
      duration,
      classification,
      genre_id,
      trailer_url,
      release_date
    } = req.body;

    const image_url = req.file ? `/img/${req.file.filename}` : '';

    const [result] = await pool.query(
      `INSERT INTO movies 
      (title, synopsis, duration, classification, genre_id, trailer_url, image_url, release_date, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [title, synopsis, duration, classification, genre_id, trailer_url, image_url, release_date]
    );

    res.status(201).json({
      message: 'Película guardada correctamente',
      id: result.insertId
    });
  } catch (err) {
    console.error('❌ Error al guardar película:', err);
    res.status(500).json({ error: 'Error al guardar película' });
  }
});


// Login (a implementar)
app.post('/api/login', async (req, res) => {
  // Lógica de autenticación
});


// Iniciar servidor
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
