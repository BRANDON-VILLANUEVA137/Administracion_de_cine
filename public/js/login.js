const apiUrl = 'https://administraciondecine-gestion-de-cine.up.railway.app';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMsg');
  
    try {
      const res = await fetch(apiUrl + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // importante si usas cookies con sesiones
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Redirigir al home o sección protegida
        window.location.href = '/peliculas';
      } else {
        errorMsg.textContent = data.message || 'Error al iniciar sesión';
      }
    } catch (error) {
      errorMsg.textContent = 'Error de red. Intenta nuevamente.';
    }
  });
  