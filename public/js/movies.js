  const API_BASE = 'https://administraciondecine-gestion-de-cine.up.railway.app';

  async function cargarPeliculas() {
    try {
      const res = await fetch(`${API_BASE}/api/movies`);
      const peliculas = await res.json();

      const contenedor = document.querySelector('.movies-grid');
      contenedor.innerHTML = ''; // Limpia tarjetas fijas

      peliculas.forEach(pelicula => {
        const card = document.createElement('div');
        card.classList.add('movie-card');

        card.innerHTML = `
          <img src="${pelicula.image_url}" alt="${pelicula.title}">
          <h4>${pelicula.title}</h4>
          <p>Duración: ${pelicula.duration} min</p>
          <p>Estreno: ${new Date(pelicula.release_date).toLocaleDateString()}</p>
          <button onclick="verFunciones(${pelicula.id})">Ver Funciones</button>
        `;

        contenedor.appendChild(card);
      });

    } catch (error) {
      console.error('Error al cargar películas:', error);
    }
  }

  function verFunciones(idPelicula) {
    // Aquí podrías redirigir a otra vista o cargar funciones por JS
    window.location.href = `/schedule?movie=${idPelicula}`;
  }

  document.addEventListener('DOMContentLoaded', cargarPeliculas);
