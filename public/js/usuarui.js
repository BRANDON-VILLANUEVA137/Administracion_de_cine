const apiUrl = 'https://administraciondecine-gestion-de-cine.up.railway.app';
const API_URL = '/api/movies';
const peliculasContainer = document.getElementById('peliculas');
const formulario = document.getElementById('formulario');
const movieForm = document.getElementById('movieForm');
const cancelar = document.getElementById('cancelar');
const formTitle = document.getElementById('formTitle');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filtroLetras = document.getElementById('filtroLetras');
const carruselItems = document.querySelector('.carrusel-items');

// Variables para control del carrusel
let currentSlide = 0;
let slides = [];
let intervalId;

// Filtro para busqueda
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

// Filtro para ordenar a-z
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

// Filtro para cada letra
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

// Cargar películas para el listado
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
      <button onclick="verTrailer('${pelicula.trailer_url}')">Ver Trailer</button>
      <p>${pelicula.description}</p>

    `;
    peliculasContainer.appendChild(div);
  });
};

// Cargar películas destacadas para el carrusel
const cargarPeliculasDestacadas = async () => {
  const res = await fetch(apiUrl + API_URL);
  const peliculas = await res.json();
  
  // Limpiar el carrusel
  carruselItems.innerHTML = '';
  
  // Tomar las primeras 4 películas como destacadas (o todas si hay menos de 4)
  const destacadas = peliculas.slice(0, 4);
  
  destacadas.forEach((pelicula, index) => {
    const item = document.createElement('div');
    item.classList.add('itemCarrusel');
    item.innerHTML = `
      <div class="tarjetaCarrusel" style="background-image: url('${pelicula.image_url}')"></div>
      <div class="flechasCarrusel">
        <i>‹</i>
        <i>›</i>
      </div>
    `;
    carruselItems.appendChild(item);
  });
  
  // Guardar referencia a los slides
  slides = document.querySelectorAll('.itemCarrusel');
  
  // Configurar eventos para las flechas
  configurarControlesCarrusel();
  
  // Iniciar animación automática
  iniciarCarruselAutomatico();
};

// Configurar controles del carrusel
const configurarControlesCarrusel = () => {
  const flechas = document.querySelectorAll('.flechasCarrusel i');
  
  flechas.forEach((flecha, index) => {
    flecha.addEventListener('click', () => {
      // Detener la animación automática al interactuar manualmente
      detenerCarruselAutomatico();
      
      if (index === 0) {
        // Flecha izquierda
        moverAnterior();
      } else {
        // Flecha derecha
        moverSiguiente();
      }
      
      // Reiniciar el temporizador después de 5 segundos
      setTimeout(iniciarCarruselAutomatico, 5000);
    });
  });
};

// Mover al slide siguiente
const moverSiguiente = () => {
  currentSlide = (currentSlide + 1) % slides.length;
  actualizarCarrusel();
};

// Mover al slide anterior
const moverAnterior = () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  actualizarCarrusel();
};

// Actualizar posición del carrusel
const actualizarCarrusel = () => {
  const offset = -currentSlide * 100;
  carruselItems.style.transform = `translateX(${offset}%)`;
};

// Iniciar animación automática
const iniciarCarruselAutomatico = () => {
  intervalId = setInterval(moverSiguiente, 5000); // Cambia cada 5 segundos
};

// Detener animación automática
const detenerCarruselAutomatico = () => {
  clearInterval(intervalId);
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  cargarPeliculas();
  cargarPeliculasDestacadas();
  
  // Pausar carrusel al hacer hover
  const carrusel = document.querySelector('.carrusel');
  carrusel.addEventListener('mouseenter', detenerCarruselAutomatico);
  carrusel.addEventListener('mouseleave', iniciarCarruselAutomatico);
});


const modal = document.getElementById('modalTrailer');
const iframe = document.getElementById('trailerFrame');
const cerrar = document.querySelector('.cerrar');

const verTrailer = (url) => {
  if (!url) return alert("Esta película no tiene trailer disponible.");

  // Si es un enlace de YouTube en formato watch?v=, lo convertimos a embed
  if (url.includes("watch?v=")) {
    const videoId = url.split("watch?v=")[1].split("&")[0]; // toma solo el ID del video
    url = `https://www.youtube.com/embed/${videoId}`;
  }

  // También aceptamos enlaces cortos tipo youtu.be
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    url = `https://www.youtube.com/embed/${videoId}`;
  }

  document.getElementById('trailerFrame').src = url;
  document.getElementById('modalTrailer').style.display = 'flex';
};
cerrar.addEventListener('click', () => {
  modal.style.display = 'none';
  iframe.src = ''; // Limpia el iframe para que el video se detenga
});
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    iframe.src = '';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const modoBtn = document.getElementById('modo-btn');

  // Cargar preferencia del usuario
  if (localStorage.getItem('modo') === 'oscuro') {
    body.classList.add('dark-mode');
  }

  modoBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const modoActual = body.classList.contains('dark-mode') ? 'oscuro' : 'claro';
    localStorage.setItem('modo', modoActual);
  });
});

document.getElementById('InitSesion').addEventListener('click', () => {
  window.location.href = 'https://senzacine.netlify.app/views/login';
});

