const express = require('express');
const db = require('./db')
const PORT = process.env.PORT || 8080;
const path = require('path');
const cors = require('cors');
const app = express();
const movieRoutes = require('../controller/Routes/movieRoutes');

const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500','https://senzacine.netlify.app'], // agrega más si lo necesitas
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

//Rutas Archivos estaticos
app.use('/img', express.static(path.join(__dirname, 'public/img')));

//Rutas
app.use('/api/movies', movieRoutes);

//Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
