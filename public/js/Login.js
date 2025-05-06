// public/js/Login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  if (!email || !password) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    const response = await fetch('https://administraciondecine-gestion-de-cine.up.railway.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // <- Esto es necesario para que se mantenga la sesión
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message);
      return;
    }

    const data = await response.json();
    const role = data.role;

    // Redirigir según rol
    switch (role) {
      case 'admin':
        window.location.href = 'https://senzacine.netlify.app/views/Admin/Home';
        break;
      case 'cajero':
        window.location.href = 'https://senzacine.netlify.app/views/cajero/home';
        break;
      case 'cliente':
        window.location.href = 'https://senzacine.netlify.app/views/peliculas.html';
        break;
      default:
        alert('Rol desconocido');
    }
  } catch (error) {
    console.error(error);
    alert('Error al iniciar sesión');
  }
});
