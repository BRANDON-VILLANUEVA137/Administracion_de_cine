document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.getElementById('home-link').addEventListener('click', (e) => {
      e.preventDefault();
      loadHomePage();
    });
  
    document.getElementById('movies-link').addEventListener('click', (e) => {
      e.preventDefault();
      loadMoviesPage();
    });
  
    document.getElementById('schedule-link').addEventListener('click', (e) => {
      e.preventDefault();
      loadSchedulePage();
    });
  
    document.getElementById('login-link').addEventListener('click', (e) => {
      e.preventDefault();
      loadLoginPage();
    });
  
    // Initial load
    loadHomePage();
  });
  
  function loadHomePage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <section class="hero">
        <h2>Bienvenido al Sistema de Gestión de Cine</h2>
        <p>Gestiona películas, salas, horarios y ventas de boletos</p>
      </section>
      <section class="current-movies">
        <h3>Películas en cartelera</h3>
        <div class="movies-grid" id="movies-grid"></div>
      </section>
    `;
    
    fetchMovies();
  }
  
  async function fetchMovies() {
    try {
      const response = await fetch('https://administraciondecine-gestion-de-cine.up.railway.app/api/movies');
      const movies = await response.json();
  
      if (Array.isArray(movies)) {
        displayMovies(movies);
      } else {
        console.error('La respuesta no es un arreglo:', movies);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }
  
  function displayMovies(movies) {
    const moviesGrid = document.getElementById('movies-grid');
    moviesGrid.innerHTML = movies.map(movie => `
      <div class="movie-card">
        <img src="${movie.image_url || 'https://via.placeholder.com/300x450'}" alt="${movie.title}">
        <h4>${movie.title}</h4>
        <p>${movie.classification} | ${movie.duration} min</p>
        <button class="btn-view-movie" data-id="${movie.id}">Ver más</button>
      </div>
    `).join('');
  
    // Add event listeners to buttons
    document.querySelectorAll('.btn-view-movie').forEach(button => {
      button.addEventListener('click', (e) => {
        const movieId = e.target.getAttribute('data-id');
        loadMovieDetails(movieId);
      });
    });
  }
  

  function showAddMovieForm() {
    const formContainer = document.getElementById('movie-form-container');
    formContainer.innerHTML = `
      <form id="movie-form">
        <div class="form-group">
          <label for="title">Título:</label>
          <input type="text" id="title" required>
        </div>
        <div class="form-group">
          <label for="classification">Clasificación:</label>
          <input type="text" id="classification" required>
        </div>
        <div class="form-group">
          <label for="duration">Duración (min):</label>
          <input type="number" id="duration" required>
        </div>
        <div class="form-group">
<label for="image">Imagen:</label>
    <input type="file" id="image" name="image" accept="image/*" required>
        </div>
        <button type="submit">Guardar Película</button>
      </form>
    `;
  
    document.getElementById('movie-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('classification', document.getElementById('classification').value);
        formData.append('duration', document.getElementById('duration').value);
        formData.append('image', document.getElementById('image').files[0]);
      
        try {
          const response = await fetch('https://administraciondecine-gestion-de-cine.up.railway.app/api/movies', {
            method: 'POST',
            body: formData
          });
      
          const data = await response.json();
          if (response.ok) {
            alert('Película agregada con éxito');
            loadMoviesPage();
          } else {
            alert(data.error || 'Error al guardar la película');
          }
        } catch (error) {
          console.error('Error al guardar película:', error);
          alert('Error de conexión');
        }
      });
      }
  

  function loadMovieDetails(movieId) {
    // Implement movie details view
    console.log('Loading details for movie:', movieId);
  }
  
  function loadMoviesPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <section class="movies-management">
        <h2>Gestión de Películas</h2>
        <button id="add-movie-btn">Agregar Película</button>
        <div id="movie-form-container"></div>
        <div class="movies-grid" id="movies-grid"></div>
      </section>
    `;
  
    setTimeout(() => {
        fetchMovies();
      }, 0);
      
    // Mostrar formulario para nueva película
    document.getElementById('add-movie-btn').addEventListener('click', () => {
      showAddMovieForm();
    });
  }
    
  
  
  function loadSchedulePage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <section class="schedule-management">
        <h2>Cartelera</h2>
        <div class="date-selector">
          <input type="date" id="schedule-date">
          <button id="search-btn">Buscar</button>
        </div>
        <div class="schedule-list" id="schedule-list"></div>
      </section>
    `;
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('schedule-date').value = today;
    
    // Load screenings for today
    fetchScreenings(today);
    
    // Add event listener to search button
    document.getElementById('search-btn').addEventListener('click', () => {
      const date = document.getElementById('schedule-date').value;
      fetchScreenings(date);
    });
  }
  
  async function fetchScreenings(date) {
    try {
      const response = await fetch(`https://administraciondecine-gestion-de-cine.up.railway.app/api/screenings?date=${date}`);
      const screenings = await response.json();
      displayScreenings(screenings);
    } catch (error) {
      console.error('Error fetching screenings:', error);
    }
  }
  
  function displayScreenings(screenings) {
    const scheduleList = document.getElementById('schedule-list');
    
    if (screenings.length === 0) {
      scheduleList.innerHTML = '<p>No hay funciones programadas para esta fecha.</p>';
      return;
    }
    
    scheduleList.innerHTML = screenings.map(screening => `
      <div class="screening-card">
        <h4>${screening.movie_title}</h4>
        <p>Sala: ${screening.room_name} (${screening.room_type})</p>
        <p>Hora: ${new Date(screening.start_time).toLocaleTimeString()} - ${new Date(screening.end_time).toLocaleTimeString()}</p>
        <p>Precio: $${screening.price}</p>
        <button class="btn-book" data-id="${screening.id}">Reservar</button>
      </div>
    `).join('');
    
    // Add event listeners to booking buttons
    document.querySelectorAll('.btn-book').forEach(button => {
      button.addEventListener('click', (e) => {
        const screeningId = e.target.getAttribute('data-id');
        loadBookingPage(screeningId);
      });
    });
  }
  
  function loadLoginPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <section class="auth-form">
        <h2>Iniciar Sesión</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Usuario:</label>
            <input type="text" id="username" required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit">Ingresar</button>
        </form>
        <p>¿No tienes cuenta? <a href="#" id="register-link">Regístrate aquí</a></p>
      </section>
    `;
    
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          alert('Inicio de sesión exitoso');
          loadHomePage();
        } else {
          alert(data.error || 'Error al iniciar sesión');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
      }
    });
    
    document.getElementById('register-link').addEventListener('click', (e) => {
      e.preventDefault();
      loadRegisterPage();
    });
  }
  
  function loadRegisterPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <section class="auth-form">
        <h2>Registro</h2>
        <form id="register-form">
          <div class="form-group">
            <label for="reg-username">Usuario:</label>
            <input type="text" id="reg-username" required>
          </div>
          <div class="form-group">
            <label for="reg-email">Email:</label>
            <input type="email" id="reg-email" required>
          </div>
          <div class="form-group">
            <label for="reg-password">Contraseña:</label>
            <input type="password" id="reg-password" required>
          </div>
          <div class="form-group">
            <label for="reg-role">Rol:</label>
            <select id="reg-role">
              <option value="customer">Cliente</option>
              <option value="cashier">Cajero</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="submit">Registrarse</button>
        </form>
        <p>¿Ya tienes cuenta? <a href="#" id="login-link">Inicia sesión aquí</a></p>
      </section>
    `;
    
    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const role = document.getElementById('reg-role').value;
      
      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, role }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          alert('Registro exitoso. Por favor inicia sesión.');
          loadLoginPage();
        } else {
          alert(data.error || 'Error al registrarse');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
      }
    });
    
    document.getElementById('login-link').addEventListener('click', (e) => {
      e.preventDefault();
      loadLoginPage();
    });
  }