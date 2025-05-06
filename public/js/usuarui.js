const apiUrl = 'https://administraciondecine-gestion-de-cine.up.railway.app';
;
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
    `;
    peliculasContainer.appendChild(div);
  });
};

// Inicializar
cargarPeliculas();
