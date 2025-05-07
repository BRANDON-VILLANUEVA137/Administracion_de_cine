const apiUrl = 'https://administraciondecine-gestion-de-cine.up.railway.app';


const API_URL = '/api/movies';
const peliculasContainer = document.getElementById('peliculas');
const formulario = document.getElementById('formulario');
const movieForm = document.getElementById('movieForm');
const btnAgregar = document.getElementById('btnAgregar');
const cancelar = document.getElementById('cancelar');
const formTitle = document.getElementById('formTitle');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filtroLetras = document.getElementById('filtroLetras');


//Filtro para busqueda
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const peliculas = document.querySelectorAll('.pelicula');

  peliculas.forEach(pelicula => {
    const title = pelicula.querySelector('h3').textContent.toLowerCase();
    const genre = pelicula.querySelector('p:nth-of-type(2)').textContent.toLowerCase();

    if (title.includes(query) || genre.includes(query)) {
      pelicula.style.display = 'block';
    } else {
      pelicula.style.display = 'none';
    }
  });
});

//Filtro para ordenar a-z
sortSelect.addEventListener('change', () => {
  const option = sortSelect.value;
  const peliculasArray = Array.from(peliculasContainer.children);

  peliculasArray.sort((a, b) => {
    const titleA = a.querySelector('h3').textContent.toLowerCase();
    const titleB = b.querySelector('h3').textContent.toLowerCase();

    if (option === 'az') {
      return titleA.localeCompare(titleB);
    } else if (option === 'za') {
      return titleB.localeCompare(titleA);
    }
    return 0;
  });

  // Limpiar y volver a agregar en orden
  peliculasContainer.innerHTML = '';
  peliculasArray.forEach(pelicula => peliculasContainer.appendChild(pelicula));
});

// Crear botones de A-Z
const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
letras.forEach(letra => {
  const btn = document.createElement('button');
  btn.textContent = letra;
  btn.addEventListener('click', () => filtrarPorLetra(letra));
  filtroLetras.appendChild(btn);
});

//Filtro para cada letra
const filtrarPorLetra = (letra) => {
  const peliculas = document.querySelectorAll('.pelicula');

  peliculas.forEach(pelicula => {
    const title = pelicula.querySelector('h3').textContent.toUpperCase();
    
    if (title.startsWith(letra)) {
      pelicula.style.display = 'block';
    } else {
      pelicula.style.display = 'none';
    }
  });
};


// Mostrar formulario para agregar película
btnAgregar.addEventListener('click', () => {
  formulario.classList.remove('oculto');
  movieForm.reset();
  formTitle.textContent = "Agregar Nueva Película";
});

// Cancelar y ocultar formulario
cancelar.addEventListener('click', () => {
  formulario.classList.add('oculto');
});

// Cargar películas
const cargarPeliculas = async () => {
  peliculasContainer.innerHTML = '';
  const res = await fetch(apiUrl + API_URL);
  const peliculas = await res.json();
  
  peliculas.forEach(pelicula => {
    const div = document.createElement('div');
    div.classList.add('pelicula');
    div.innerHTML = `
      <h3>${pelicula.title}</h3>
      <img src="${pelicula.image_url}" alt="${pelicula.title}">
      <p><strong>Duración:</strong> ${pelicula.duration} min</p>
      <p><strong>Género:</strong> ${pelicula.genre}</p>
      <p><strong>Clasificación:</strong> ${pelicula.rating}</p>
      <p>${pelicula.description}</p>
      <button onclick="editarPelicula(${pelicula.id})">Editar</button>
      <button onclick="eliminarPelicula(${pelicula.id})">Eliminar</button>
    `;
    peliculasContainer.appendChild(div);
  });
};

// Guardar (crear o actualizar) película
movieForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('movieId').value;
  const movie = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    duration: document.getElementById('duration').value,
    rating: document.getElementById('rating').value,
    genre: document.getElementById('genre').value,
    trailer_url: document.getElementById('trailer_url').value,
    image_url: document.getElementById('image_url').value
  };

  if (id) {
    // Actualizar película
    await fetch(`${apiUrl}${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie)
    });
  } else {
    // Crear nueva película
    await fetch(apiUrl + API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie)
    });
  }

  formulario.classList.add('oculto');
  cargarPeliculas();
});

// Editar película
const editarPelicula = async (id) => {
  const res = await fetch(`${apiUrl}${API_URL}/${id}`);
  const pelicula = await res.json();

  document.getElementById('movieId').value = pelicula.id;
  document.getElementById('title').value = pelicula.title;
  document.getElementById('description').value = pelicula.description;
  document.getElementById('duration').value = pelicula.duration;
  document.getElementById('rating').value = pelicula.rating;
  document.getElementById('genre').value = pelicula.genre;
  document.getElementById('trailer_url').value = pelicula.trailer_url;
  document.getElementById('image_url').value = pelicula.image_url;

  formulario.classList.remove('oculto');
  formTitle.textContent = "Editar Película";
};

// Eliminar película
const eliminarPelicula = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta película?')) {
    await fetch(`${apiUrl}${API_URL}/${id}`, { method: 'DELETE' });
    cargarPeliculas();
  }
};

// Inicializar
cargarPeliculas();
